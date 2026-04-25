"""Utility script to start the Next.js app with default settings."""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def build_parser() -> argparse.ArgumentParser:
    """Create CLI parser with defaults for local development."""
    parser = argparse.ArgumentParser(description="Start ZenithFit Next.js server")
    parser.add_argument("--host", default="127.0.0.1", help="Host for the Next.js server")
    parser.add_argument("--port", default="3000", help="Port for the Next.js server")
    parser.add_argument(
        "--script",
        default="dev",
        choices=("dev", "start"),
        help="npm script to run (dev for development, start for production build)",
    )
    return parser


def main() -> int:
    """Run npm command with standard defaults and environment checks."""
    args = build_parser().parse_args()
    project_root = Path(__file__).resolve().parent

    package_json = project_root / "package.json"
    if not package_json.exists():
        print("Помилка: package.json не знайдено поруч із server.py.")
        return 1

    env = os.environ.copy()
    env["HOSTNAME"] = args.host
    env["PORT"] = str(args.port)

    command = ["npm", "run", args.script]
    print(f"Виконується команда: {' '.join(command)} (HOSTNAME={args.host}, PORT={args.port})")

    try:
        subprocess.run(command, cwd=project_root, check=True, env=env)
    except KeyboardInterrupt:
        print("\nСервер зупинено користувачем.")
        return 0
    except FileNotFoundError:
        print("Помилка: npm не знайдено. Встановіть Node.js та npm.")
        return 1
    except subprocess.CalledProcessError as error:
        print(f"Помилка запуску npm: {error}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
