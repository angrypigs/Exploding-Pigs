import os
import json
from PIL import Image
import numpy as np
import random

FRAME_PATH = "frame.png"
DATA_PATH = "cards_data.json"
IMAGES_DIR = "images"
OUTPUT_DIR = "temp_images"

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(DATA_PATH, "r", encoding="utf-8") as f:
    cards = json.load(f)

try:
    base_frame = Image.open(FRAME_PATH).convert("RGBA")
except FileNotFoundError:
    raise FileNotFoundError(f"Nie znaleziono pliku ramki: {FRAME_PATH}")

card_width, card_height = base_frame.size

for key, card in cards.items():
    print(f"Generowanie karty: {key} ({card['name']})")

    icon_filename = f"{card['img']}.png"
    icon_path = os.path.join(IMAGES_DIR, icon_filename)
    
    if not os.path.exists(icon_path):
        print(f"Brak ikony: {icon_path} — pomijam.")
        output_path = os.path.join(OUTPUT_DIR, f"temp_{key}.png")
        base_frame.save(output_path)
        continue

    icon = Image.open(icon_path).convert("RGBA")
    card_img = base_frame.copy()
    card_width, card_height = card_img.size
    surface_width = int(card_width * 0.9)
    surface_height = int(card_height * 0.75)
    icon_surface = Image.new("RGBA", (surface_width, surface_height), (0, 0, 0, 0))
    max_icon_w = int(card_width * 0.6)
    max_icon_h = int(card_height * 0.6)
    icon_w, icon_h = icon.size
    scale = min(max_icon_w / icon_w, max_icon_h / icon_h)
    new_w = int(icon_w * scale)
    new_h = int(icon_h * scale)
    icon_resized = icon.resize((new_w, new_h), Image.LANCZOS)
    
    pos_x = (surface_width - new_w) // 2
    pos_y = (surface_height - new_h) // 2
    
    arr = np.array(icon_resized)
    print(arr.shape)
    icon_resized = Image.fromarray(arr, mode="RGBA")
    
    icon_surface.paste(icon_resized, (pos_x, pos_y), icon_resized)
    
    final_x = (card_width - surface_width) // 2
    final_y = (card_height - surface_height) // 2
    
    arr = np.array(icon_surface) 
    middle = (surface_height // 2, surface_width // 2) 
    scalar = 8 / 10 
    d_max = np.sqrt((middle[0] * scalar)**2 + ((middle[1] * scalar)**2)) 
    rand_radius = 10 
    sector_radius = 40
    for r in range(arr.shape[0]): 
        for c in range(arr.shape[1]): 
            if arr[r][c][3] == 0: 
                r_src = np.clip(r, pos_y, pos_y + new_h - 0) 
                c_src = np.clip(c, pos_x, pos_x + new_w - 0) 
                x1 = max(c_src - sector_radius, 0)
                x2 = min(c_src + sector_radius + 1, arr.shape[1])
                y1 = max(r_src - sector_radius, 0)
                y2 = min(r_src + sector_radius + 1, arr.shape[0])
                d = np.sqrt((middle[0] + random.randint(-rand_radius, rand_radius) - r)**2 + 
                            (middle[1] + random.randint(-rand_radius, rand_radius) - c)**2) 
                neighborhood = arr[y1:y2, x1:x2]
                mask = neighborhood[..., 3] > 0
                if np.any(mask):
                    r_mean = neighborhood[..., 0][mask].mean()
                    g_mean = neighborhood[..., 1][mask].mean()
                    b_mean = neighborhood[..., 2][mask].mean()
                else:
                    r_mean, g_mean, b_mean = 0, 0, 0
                arr[r][c] = np.concatenate([[r_mean, g_mean, b_mean], 
                                            [255 - np.clip((d / d_max if d < d_max else 255) * 255, 0, 255)]]).astype(np.uint8)
            
    icon_surface = Image.fromarray(arr, mode="RGBA")
    
    card_img.paste(icon_surface, (final_x, final_y), icon_surface)

    output_path = os.path.join(OUTPUT_DIR, f"temp_{key}.png")
    card_img.save(output_path, "PNG")

print(f"\nWygenerowano {len(cards)} kart w folderze '{OUTPUT_DIR}'")