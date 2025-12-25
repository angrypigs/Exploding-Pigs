import { useState } from 'react';
import { Text } from 'react-native';

import { stylesMain } from '../../../styles/stylesMain';
import { range } from '../../../utils/gameUtils';
import PlayerHand from '../PlayerHand';
import PopupBox from '../popupBox';

export default function ChangeCardsPopup({ cards, onExit }) {
    const [cardsInput, setCardsInput] = useState(range(cards.length));
    const [cardsOutput, setCardsOutput] = useState([]);

    const inputToOutput = index => {
        setCardsInput(prev => prev.filter(x => x !== index));
        setCardsOutput(prev => [...prev, index]);
    };

    const outputToInput = index => {
        setCardsOutput(prev => prev.filter(x => x !== index));
        setCardsInput(prev => [...prev, index]);
    };

    const exitCheck = () => {
        if (cardsInput.length !== 0) return;
        const n = cardsOutput.length;
        const fixedIndexes = cardsOutput.slice().map(visualIndex => n - 1 - visualIndex);
        onExit(fixedIndexes);
    };

    return (
        <PopupBox title={'Change top cards'} onExit={exitCheck}>
            <Text style={[stylesMain.text, { fontSize: 16 }]}>
                Throw cards from the top deck to the bottom one in the order you desire
            </Text>
            <Text style={stylesMain.text}>Input cards</Text>
            <PlayerHand
                cards={{ hand: cardsInput.map(i => cards[i]) }}
                selectedCards={[]}
                onSelectCard={index => inputToOutput(cardsInput[index])}
            />
            <Text style={stylesMain.text}>Output cards (starting from the top one)</Text>
            <PlayerHand
                cards={{ hand: cardsOutput.map(i => cards[i]) }}
                selectedCards={[]}
                onSelectCard={index => outputToInput(cardsOutput[index])}
            />
        </PopupBox>
    );
}
