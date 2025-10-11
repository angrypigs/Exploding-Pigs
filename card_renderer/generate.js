import fs from 'fs';
import path from 'path';
import nodeHtmlToImage from 'node-html-to-image';

async function generateCards() {
  const data = JSON.parse(fs.readFileSync('cards_data.json', 'utf8'));
  const cssTemplate = fs.readFileSync('style.css', 'utf8');
  const outputDir = path.join(process.cwd(), '../client/assets/textures/cards');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const cardTemplate = `
  <div id="card" style="background-color: {{BG_COLOR}};" >
    <div id="card-container">
      <p id="title">{{NAME}}</p>
      <img id="img" src="{{IMAGE}}" />
      <p id="desc">{{DESC}}</p>
    </div>
  </div>`;

  for (const key of Object.keys(data)) {
    const card = data[key];
    const imgPath = path.join(process.cwd(), 'images', `${data[key]["img"]}.png`);
    const imageBuffer = fs.readFileSync(imgPath);
    const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    const html = cardTemplate
      .replace('{{NAME}}', card.name)
      .replace('{{DESC}}', card.desc)
      .replace('{{IMAGE}}', imageBase64)
      .replace('{{BG_COLOR}}', card.color);
    const fullHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${cssTemplate}</style></head><body>${html}</body></html>`;
    const buffer = await nodeHtmlToImage({ html: fullHtml, type: 'png', encoding: 'binary',
  selector: '#card', transparent: true });
    fs.writeFileSync(path.join(outputDir, `${key}.png`), buffer);
    console.log(`Wygenerowano: ${key}.png`);
  }

  console.log('Wszystkie karty zapisane w folderze output_cards');
}

generateCards();
 