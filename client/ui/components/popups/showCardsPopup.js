import PlayerHand from '../PlayerHand';
import PopupBox from '../popupBox';

export default function ShowCardsPopup({ cards, onExit, title }) {
    return (
        <PopupBox title={title} onExit={onExit}>
            <PlayerHand cards={{ hand: cards }} selectedCards={[]} onSelectCard={() => {}} />
        </PopupBox>
    );
}
