import PlayerList from '../PlayerList';
import PopupBox from '../popupBox';

export default function ChoosePlayerPopup({ cards, onExit, showSelf, title }) {
    return (
        <PopupBox title={title}>
            <PlayerList cards={cards} showSelf={showSelf} onSelect={onExit} />
        </PopupBox>
    );
}
