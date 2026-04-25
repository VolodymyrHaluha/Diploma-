import subprocess
import sys
import os

def main():
    """
    Скрипт для запуску Next.js сервера розробки ZenithFit.
    Цей скрипт є Python-обгорткою для команди 'npm run dev'.
    """
    print("========================================")
    print("   ZenithFit: Запуск веб-сервера...   ")
    print("========================================")
    
    # Перевіряємо, чи ми в правильній директорії (шукаємо package.json)
    if not os.path.exists("package.json"):
        print("Помилка: Файл package.json не знайдено. Переконайтеся, що ви запускаєте скрипт з кореневої папки проекту.")
        sys.exit(1)
        
    try:
        # Запускаємо сервер розробки Next.js (на порті 9002, як вказано в package.json)
        print("Виконується команда: npm run dev")
        # subprocess.run запускає процес і чекає на його завершення
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\nСервер зупинено користувачем.")
        sys.exit(0)
    except subprocess.CalledProcessError as e:
        print(f"Помилка під час запуску npm: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("Помилка: Команду 'npm' не знайдено. Будь ласка, встановіть Node.js та npm, щоб проект міг працювати.")
        sys.exit(1)

if __name__ == "__main__":
    main()
