import subprocess
import socket
import json
import os
import sys

PORT = "4000"

def load_source_env():
    env_vars = {}
    env_path = ".env"
    
    if not os.path.exists(env_path):
        print(f"BŁĄD: Nie znaleziono pliku '{env_path}' w głównym katalogu!")
        print("Stwórz plik .env i dodaj tam: CLOUD_URL=... oraz GAME_SECRET=...")
        input("Naciśnij Enter, aby zamknąć...")
        sys.exit(1)

    try:
        with open(env_path, "r", encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue

                if "=" in line:
                    key, value = line.split("=", 1)
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")

        if "CLOUD_URL" not in env_vars or "GAME_SECRET" not in env_vars:
            print("BŁĄD: W pliku .env brakuje klucza CLOUD_URL lub GAME_SECRET!")
            sys.exit(1)
            
        return env_vars["CLOUD_URL"], env_vars["GAME_SECRET"]

    except Exception as e:
        print(f"Błąd podczas czytania .env: {e}")
        sys.exit(1)

def update_eas_json(client_api_url, game_secret):
    eas_structure = {
        "cli": {
            "version": ">= 7.0.0"
        },
        "build": {
            "development": {
                "developmentClient": True,
                "distribution": "internal"
            },
            "preview": {
                "distribution": "internal",
                "android": {
                    "buildType": "apk"
                },
                "env": {} 
            },
            "production": {}
        },
        "submit": {
            "production": {}
        }
    }

    eas_structure["build"]["preview"]["env"] = {
        "EXPO_PUBLIC_API_URL": client_api_url,
        "EXPO_PUBLIC_GAME_SECRET": game_secret
    }

    try:
        with open("client/eas.json", "w") as f:
            json.dump(eas_structure, f, indent=4)
        print("eas.json został wygenerowany i zaktualizowany.")
    except Exception as e:
        print(f"Błąd przy zapisie eas.json: {e}")

def get_ip_socket():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def get_ip_wifi():
    try:
        result = subprocess.check_output("ipconfig", shell=True, text=True)
        in_wifi = False
        for line in result.splitlines():
            if "Wireless LAN adapter Wi-Fi" in line:
                in_wifi = True
                continue
            if in_wifi and "IPv4 Address" in line:
                return line.split(":")[-1].strip()
    except Exception:
        pass
    return "127.0.0.1"

def update_local_env(client_api_url, server_ip, game_secret):
    client_content = f"EXPO_PUBLIC_API_URL={client_api_url}\nEXPO_PUBLIC_GAME_SECRET={game_secret}"
    server_content = f"PORT={PORT}\nIP={server_ip}\nGAME_SECRET={game_secret}"

    try:
        with open("client/.env", 'w') as f:
            f.write(client_content)
        
        with open("server/.env", "w") as f:
            f.write(server_content)
        
        print("Pliki .env dla klienta i serwera zaktualizowane.")
    except Exception as e:
        print(f"Błąd zapisu plików .env: {e}")

def main():
    CLOUD_URL, GAME_SECRET = load_source_env()

    print(f"--- KONFIGURATOR ---")
    print(f"w = WiFi (Lokalnie)")
    print(f"c = Cable/Auto (Lokalnie)")
    print(f"inne = CLOUD RUN (Klient -> Chmura)")
    
    mode = input("Wybierz tryb: ").strip().lower()

    local_ip = get_ip_wifi() if mode == "w" else get_ip_socket()

    if mode == "w":
        print(f"Tryb WiFi (Lokalnie): {local_ip}")
        api_url = f"http://{local_ip}:{PORT}"
        server_bind = local_ip
        
    elif mode == "c":
        print(f"Tryb Cable (Lokalnie): {local_ip}")
        api_url = f"http://{local_ip}:{PORT}"
        server_bind = local_ip
        
    else:
        print(f"Tryb CLOUD: API -> {CLOUD_URL}")
        api_url = CLOUD_URL
        server_bind = "127.0.0.1"

    update_local_env(api_url, server_bind, GAME_SECRET)

    update_eas_json(api_url, GAME_SECRET)

    print(f"Ustawiam REACT_NATIVE_PACKAGER_HOSTNAME na: {local_ip}")
    try:
        subprocess.run(
            ["setx", "REACT_NATIVE_PACKAGER_HOSTNAME", local_ip],
            check=True
        )
        print("Zmienna środowiskowa ustawiona.")
    except Exception as e:
        print(f"Nie udało się ustawić setx (może brak uprawnień?): {e}")

if __name__ == "__main__":
    main()