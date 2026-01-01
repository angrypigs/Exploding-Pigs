import { useState } from 'react';
import PlayerHand from '../PlayerHand';
import PlayerList from '../PlayerList';
import PopupBox from '../popupBox';

export default function ChooseCardFromPlayerPopup({ cards, onExit, showSelf, title }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    return (
        <PopupBox title={title}>
            <PlayerList cards={cards} showSelf={showSelf} onSelect={p => setSelectedPlayer(p)} />
            {selectedPlayer !== null && (
                <PlayerHand
                    cards={{ hand: selectedPlayer?.hand }}
                    selectedCards={[]}
                    onSelectCard={idx => {
                        if (onExit) onExit({ player: selectedPlayer?.['publicId'], card: idx });
                    }}
                />
            )}
        </PopupBox>
    );
}
