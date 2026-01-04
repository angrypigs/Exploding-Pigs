import subprocess

PORT = "4000"

import socket

def get_local_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def update_local_env(IP):
    client_api = f"EXPO_PUBLIC_API_URL=http://{IP}:{PORT}"
    server_port = f"PORT={PORT}"
    server_ip = f"IP={IP}"

    with open("client/.env", 'w') as f:
        f.write(client_api)
    
    with open("server/.env", "w") as f:
        f.write(f"{server_port}\n{server_ip}")

def main():
    ip = get_local_ip()
    update_local_env(ip)
    subprocess.run(
        f'setx REACT_NATIVE_PACKAGER_HOSTNAME "{ip}"',
        shell=True
    )

if __name__ == "__main__":
    main()
