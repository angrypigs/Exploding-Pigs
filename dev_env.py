import subprocess
import socket

PORT = "4000"
CLOUD_URL = "https://twoja-gra-server.run.app"
GAME_SECRET = "CzasamiSaTakieDniZeSobieMysleAleToRzadkoXDDDD"

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

def update_local_env(client_api_url, server_ip):
    client_content = f"EXPO_PUBLIC_API_URL={client_api_url}\nEXPO_PUBLIC_GAME_SECRET={GAME_SECRET}"

    server_content = f"PORT={PORT}\nIP={server_ip}\nGAME_SECRET={GAME_SECRET}"

    with open("client/.env", 'w') as f:
        f.write(client_content)
    
    with open("server/.env", "w") as f:
        f.write(server_content)

def main():
    print(f"--- KONFIGURATOR ---")
    print(f"w = WiFi (Lokalnie)")
    print(f"c = Cable/Auto (Lokalnie)")
    print(f"inne = CLOUD RUN (Klient -> Chmura)")
    
    mode = input("Wybierz tryb: ").strip().lower()

    local_ip = get_ip_wifi() if mode == "w" else get_ip_socket()

    if mode == "w":
        print(f"✅ Tryb WiFi (Lokalnie): {local_ip}")
        api_url = f"http://{local_ip}:{PORT}"
        server_bind = local_ip
        
    elif mode == "c":
        print(f"✅ Tryb Cable (Lokalnie): {local_ip}")
        api_url = f"http://{local_ip}:{PORT}"
        server_bind = local_ip
        
    else:
        print(f"☁️ Tryb CLOUD: API -> {CLOUD_URL}")
        api_url = CLOUD_URL
        server_bind = "127.0.0.1"

    update_local_env(api_url, server_bind)

    print(f"Ustawiam REACT_NATIVE_PACKAGER_HOSTNAME na: {local_ip}")
    subprocess.run(
        ["setx", "REACT_NATIVE_PACKAGER_HOSTNAME", local_ip],
        check=True
    )

if __name__ == "__main__":
    main()