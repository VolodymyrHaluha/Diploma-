"""Flask-only launcher for ZenithFit."""

import argparse
import os
import signal
import sys
import threading
import webbrowser

try:
    from flask import Flask, Response, jsonify
except ModuleNotFoundError:
    Flask = None
    jsonify = None
    Response = None


def build_parser() -> argparse.ArgumentParser:
    """CLI options for Flask launch parameters."""
    parser = argparse.ArgumentParser(description="Run ZenithFit in Flask-only mode")
    parser.add_argument("--host", default="127.0.0.1", help="Flask host")
    parser.add_argument("--port", type=int, default=5000, help="Flask port")
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Do not open browser automatically",
    )
    return parser


def main() -> int:
    """Start Flask-only launcher."""
    args = build_parser().parse_args()

    if Flask is None:
        print("Помилка: Flask не встановлено. Виконайте: pip install flask")
        return 1

    os.environ["ZENITHFIT_MODE"] = "flask-only"
    print("Режим запуску: Flask-only (Next.js вимкнено).")

    def _handle_signal(signum: int, _frame: object) -> None:
        print(f"\nОтримано сигнал {signum}. Зупинка сервера...")
        raise SystemExit(0)

    signal.signal(signal.SIGINT, _handle_signal)
    signal.signal(signal.SIGTERM, _handle_signal)

    app = Flask(__name__)

    @app.get("/")
    def index() -> object:
        html = (
            "<h1>ZenithFit Flask Server</h1>"
            "<p>Flask запущено успішно.</p>"
            "<p>Проєкт працює у режимі Flask-only (без Next.js).</p>"
        )
        return Response(html, mimetype="text/html")

    @app.get("/health")
    def health() -> object:
        return jsonify(
            {
                "status": "ok",
                "frontend_mode": "disabled",
                "flask": f"http://{args.host}:{args.port}",
                "next": None,
                "next_pid": None,
            }
        )

    if not args.no_browser:
        threading.Timer(1.0, lambda: webbrowser.open(f"http://{args.host}:{args.port}")).start()

    print(f"Flask запущено на http://{args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=False)

    return 0


if __name__ == "__main__":
    sys.exit(main())
