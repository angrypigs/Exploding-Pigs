import PlayerHand from '../PlayerHand';
import PopupBox from '../popupBox';

export default function ShowCardsPopup({ cards, onExit }) {
    return (
        <PopupBox title={'Peek top cards'} onExit={onExit}>
            <PlayerHand cards={{ hand: cards }} selectedCards={[]} onSelectCard={() => {}} />
        </PopupBox>
    );
}
