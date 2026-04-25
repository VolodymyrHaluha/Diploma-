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

try:
    from flask import Flask, jsonify, redirect
except ModuleNotFoundError:
    Flask = None
    jsonify = None
    redirect = None



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
        help="npm script used to run Next.js",
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


def main() -> int:
    """Start Next.js process and expose Flask routes."""
    args = build_parser().parse_args()

    if Flask is None:
        print("Помилка: Flask не встановлено. Виконайте: pip install flask")
        return 1

    project_root = Path(__file__).resolve().parent.parent

    package_json = project_root / "package.json"
    if not package_json.exists():
        print("Помилка: package.json не знайдено в корені проекту.")
        return 1

    if which("npm") is None:
        print("Помилка: npm не знайдено. Встановіть Node.js та npm.")
        return 1

    env = os.environ.copy()
    env["HOSTNAME"] = args.next_host
    env["PORT"] = str(args.next_port)

    next_command = ["npm", "run", args.next_script]
    print(f"Запуск Next.js: {' '.join(next_command)} (HOSTNAME={args.next_host}, PORT={args.next_port})")

    next_process = subprocess.Popen(next_command, cwd=project_root, env=env)
    atexit.register(stop_process, next_process)

    def _handle_signal(signum: int, _frame: object) -> None:
        print(f"\nОтримано сигнал {signum}. Зупинка сервера...")
        stop_process(next_process)
        raise SystemExit(0)

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)

    app = Flask(__name__)

    @app.get("/")
    def index() -> object:
        return redirect(f"http://{args.next_host}:{args.next_port}", code=302)

    @app.get("/health")
    def health() -> object:
        return jsonify(
            {
                "status": "ok",
                "flask": f"http://{args.host}:{args.port}",
                "next": f"http://{args.next_host}:{args.next_port}",
                "next_pid": next_process.pid,
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
