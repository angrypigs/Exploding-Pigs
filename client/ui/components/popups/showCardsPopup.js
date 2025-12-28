import PlayerHand from '../PlayerHand';
import PopupBox from '../popupBox';

export default function ShowCardsPopup({ cards, title, onExit, onSelect }) {
    const defaultFunc = () => {};
    return (
        <PopupBox title={title} onExit={onExit ?? null}>
            <PlayerHand
                cards={{ hand: cards }}
                selectedCards={[]}
                onSelectCard={onSelect ?? defaultFunc}
            />
        </PopupBox>
    );
}
