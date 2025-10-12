import json

with open("cards_data.json", "r", encoding="utf-8") as f:
    cards = json.load(f)
    
for key, data in cards.items():
    print(f"\"{key}\": {{\"img\": require(\"./assets/textures/cards/{data["img"]}.png\"), \"name\": \"{data["name"]}\"}},")
