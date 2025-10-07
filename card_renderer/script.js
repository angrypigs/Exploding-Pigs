function set_card(title, desc, framePath) {
    $('#title').text(title);
    $('#desc').text(desc);
    
    const $frame = $('#card-frame');
    $frame.attr('src', framePath);

    return new Promise((resolve, reject) => {
        $frame.off('load.error');
        $frame.on('load', resolve);
        $frame.on('error', reject);
    });
}

$(document).ready(async function () {
    $('#render1').on('click', async function () {
        try {
            const data = await $.getJSON("cards_data.json");
            console.log("Dane kart:", data);
            const zip = new JSZip();
            for (const key in data) {
                if (!data.hasOwnProperty(key)) continue;
                const card = data[key];
                const framePath = `temp_images/temp_${key}.png`;
                const fileName = `${key}.png`;
                await set_card(card['name'], card['desc'], framePath);
                const element = document.getElementById('card');
                const canvas = await html2canvas(element, {
                    scale: 1,
                    useCORS: true,
                    backgroundColor: null,
                    allowTaint: false,
                    logging: false
                });
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                zip.file(fileName, blob);
                console.log(`Wygenerowano: ${fileName}`);
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, "karty.zip");
            console.log('Wszystkie karty wyeksportowane.');
        } catch (error) {
            console.error('Błąd podczas generowania kart:', error);
        }
    });
});