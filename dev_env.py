import subprocess
import socket

PORT = "4000"

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
    result = subprocess.check_output("ipconfig", shell=True, text=True)
    in_wifi = False

    for line in result.splitlines():
        if "Wireless LAN adapter Wi-Fi" in line:
            in_wifi = True
            continue

        if in_wifi and "IPv4 Address" in line:
            return line.split(":")[-1].strip()

    return "127.0.0.1"

def update_local_env(IP):
    client_api = f"EXPO_PUBLIC_API_URL=http://{IP}:{PORT}"
    server_port = f"PORT={PORT}"
    server_ip = f"IP={IP}"

    with open("client/.env", 'w') as f:
        f.write(client_api)
    
    with open("server/.env", "w") as f:
        f.write(f"{server_port}\n{server_ip}")

def main():
    mode = input("Wybierz tryb (w = wifi, k = kabel/auto): ").strip().lower()

    if mode == "w":
        ip = get_ip_wifi()
    else:
        ip = get_ip_socket()
    
    print(f"Ustawiam IP: {ip}")

    update_local_env(ip)
    subprocess.run(
        f'setx REACT_NATIVE_PACKAGER_HOSTNAME "{ip}"',
        shell=True
    )

if __name__ == "__main__":
    main()