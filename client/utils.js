export function isGameCode(str) {
  return str.length === 5 && /^\d{5}$/.test(str);
}

export const cards_data = {
  "0": {"img": require("./assets/textures/cards/0.png"), "name": "Back"},
  "1": {"img": require("./assets/textures/cards/1.png"), "name": "Exploding Pig"},
  "2": {"img": require("./assets/textures/cards/2.png"), "name": "Defusion Pig"},
  "3": {"img": require("./assets/textures/cards/3.png"), "name": "Skip"},
  "4": {"img": require("./assets/textures/cards/4.png"), "name": "Skip everything"},
  "5": {"img": require("./assets/textures/cards/5.png"), "name": "Reverse"},
  "6": {"img": require("./assets/textures/cards/6.png"), "name": "Attack"},
  "7": {"img": require("./assets/textures/cards/7.png"), "name": "Sniper"},
  "8": {"img": require("./assets/textures/cards/8.png"), "name": "Shuffle"},
  "9_3": {"img": require("./assets/textures/cards/9_3.png"), "name": "View the future (3 cards)"},    
  "9_4": {"img": require("./assets/textures/cards/9_4.png"), "name": "View the future (4 cards)"},    
  "9_5": {"img": require("./assets/textures/cards/9_5.png"), "name": "View the future (5 cards)"},    
  "10_3": {"img": require("./assets/textures/cards/10_3.png"), "name": "Change the future (3 cards)"},
  "10_4": {"img": require("./assets/textures/cards/10_4.png"), "name": "Change the future (4 cards)"},
  "10_5": {"img": require("./assets/textures/cards/10_5.png"), "name": "Change the future (5 cards)"},
  "11": {"img": require("./assets/textures/cards/11.png"), "name": "Fundraiser"},
  "12": {"img": require("./assets/textures/cards/12.png"), "name": "Profanation"},
  "13": {"img": require("./assets/textures/cards/13.png"), "name": "Nu Nu Nu"},
  "14_1": {"img": require("./assets/textures/cards/14_1.png"), "name": "Cake"},
  "14_2": {"img": require("./assets/textures/cards/14_2.png"), "name": "Ice cream"},
  "14_3": {"img": require("./assets/textures/cards/14_3.png"), "name": "Cupcake"},
  "14_4": {"img": require("./assets/textures/cards/14_4.png"), "name": "Rum bomb"},
  "14_5": {"img": require("./assets/textures/cards/14_5.png"), "name": "Cake slice"},
  "15": {"img": require("./assets/textures/cards/15.png"), "name": "Candy pumpkin"},
  "16": {"img": require("./assets/textures/cards/16.png"), "name": "Favor"},
  "17": {"img": require("./assets/textures/cards/17.png"), "name": "Piggasaki"},
  "18": {"img": require("./assets/textures/cards/18.png"), "name": "Hiropiga"},
  "19": {"img": require("./assets/textures/cards/19.png"), "name": "Take from the bottom"},
};