"""Flask launcher that starts the Next.js site with sensible defaults."""

import argparse
import atexit
import os
import signal
import subprocess
import sys
import threading
import webbrowser
from pathlib import Path
from shutil import which
from typing import Sequence

try:
    from flask import Flask, Response, jsonify, redirect
except ModuleNotFoundError:
    Flask = None
    jsonify = None
    redirect = None
    Response = None


def build_parser() -> argparse.ArgumentParser:
    """CLI options for Flask and Next.js launch parameters."""
    parser = argparse.ArgumentParser(description="Run ZenithFit through Flask + Next.js")
    parser.add_argument("--host", default="127.0.0.1", help="Flask host")
    parser.add_argument("--port", type=int, default=5000, help="Flask port")
    parser.add_argument("--next-host", default="127.0.0.1", help="Next.js host")
    parser.add_argument("--next-port", type=int, default=3000, help="Next.js port")
    parser.add_argument(
        "--next-script",
        default="dev",
        choices=("dev", "start"),
        help="JavaScript script used to run Next.js",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Do not open browser automatically",
    )
    return parser


def stop_process(process: subprocess.Popen | None) -> None:
    """Terminate child process if still running."""
    if process is None or process.poll() is not None:
        return

    process.terminate()
    try:
        process.wait(timeout=8)
    except subprocess.TimeoutExpired:
        process.kill()


def pick_js_command(script: str) -> Sequence[str] | None:
    """Find available JS package manager command for the given script."""
    if which("npm"):
        return ["npm", "run", script]
    if which("pnpm"):
        return ["pnpm", script]
    if which("yarn"):
        return ["yarn", script]
    if which("bun"):
        return ["bun", "run", script]
    return None


def main() -> int:
    """Start Flask launcher and (optionally) Next.js process."""
    args = build_parser().parse_args()

    if Flask is None:
        print("Помилка: Flask не встановлено. Виконайте: pip install flask")
        return 1

    project_root = Path(__file__).resolve().parent.parent

    package_json = project_root / "package.json"
    if not package_json.exists():
        print("Помилка: package.json не знайдено в корені проекту.")
        return 1

    js_command = pick_js_command(args.next_script)
    next_process: subprocess.Popen | None = None
    frontend_mode = "degraded"

    if js_command is None:
        print(
            "Увага: npm/pnpm/yarn/bun не знайдено. Запускаю тільки Flask. "
            "Frontend Next.js буде недоступний, поки не встановите Node.js."
        )
    else:
        env = os.environ.copy()
        env["HOSTNAME"] = args.next_host
        env["PORT"] = str(args.next_port)

        print(
            f"Запуск Next.js: {' '.join(js_command)} "
            f"(HOSTNAME={args.next_host}, PORT={args.next_port})"
        )
        next_process = subprocess.Popen(js_command, cwd=project_root, env=env)
        atexit.register(stop_process, next_process)
        frontend_mode = "ok"

    def _handle_signal(signum: int, _frame: object) -> None:
        print(f"\nОтримано сигнал {signum}. Зупинка сервера...")
        stop_process(next_process)
        raise SystemExit(0)

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)

    app = Flask(__name__)

    @app.get("/")
    def index() -> object:
        if next_process is not None and next_process.poll() is None:
            return redirect(f"http://{args.next_host}:{args.next_port}", code=302)

        html = (
            "<h1>ZenithFit Flask Server</h1>"
            "<p>Flask запущено успішно, але Next.js frontend не стартував.</p>"
            "<p>Встановіть Node.js (або npm/pnpm/yarn/bun), щоб запускати сайт повністю.</p>"
            "<p>Після встановлення перезапустіть start_server.bat.</p>"
        )
        return Response(html, mimetype="text/html")

    @app.get("/health")
    def health() -> object:
        next_alive = next_process is not None and next_process.poll() is None
        return jsonify(
            {
                "status": "ok" if next_alive else "degraded",
                "frontend_mode": frontend_mode if not next_alive else "ok",
                "flask": f"http://{args.host}:{args.port}",
                "next": f"http://{args.next_host}:{args.next_port}",
                "next_pid": next_process.pid if next_process else None,
            }
        )

    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(f"http://{args.host}:{args.port}")).start()

    print(f"Flask запущено на http://{args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=False)

    stop_process(next_process)
    return 0


if __name__ == "__main__":
    sys.exit(main())
