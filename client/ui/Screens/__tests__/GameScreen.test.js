import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import GameScreen from '../GameScreen';
import { SocketContext } from '../../../contexts/socketContext';


const mockNavigation = {
    addListener: jest.fn(() => jest.fn()),
    setOptions: jest.fn(),
    navigate: jest.fn(),
};

const mockRoute = {
    params: {
        roomCode: 'ROOM_123',
        nickname: 'TestPlayer',
    },
};

jest.mock('@react-navigation/native', () => ({
    useRoute: () => mockRoute,
    useNavigation: () => mockNavigation,
}));

jest.mock('../../../assets/pig-nose-svgrepo-com.png', () => 1);

jest.mock('../../../utils/gameUtils', () => ({
    coords: {
        deck: { x: 100, y: 100 },
        thrown: { x: 200, y: 200 },
    },
    coordsAnimHandler: jest.fn(() => ({ x: 0, y: 0 })),
}));

jest.mock('../../components/card', () => {
    const { Text, TouchableOpacity } = require('react-native');
    return ({ type, onPress, testID }) => (
        <TouchableOpacity onPress={onPress} testID={testID || `card-${type}`}>
            <Text>Card {type}</Text>
        </TouchableOpacity>
    );
});

jest.mock('../../components/PlayerHand', () => {
    const { View, Button } = require('react-native');
    return ({ onSelectCard }) => (
        <View testID="player-hand">
            <Button title="Select Card 1" onPress={() => onSelectCard(1)} />
        </View>
    );
});

jest.mock('../../components/PlayerList', () => 'PlayerList');
jest.mock('../../components/animatedCard', () => 'AnimatedCard');
jest.mock('../../components/button', () => {
    const { Button } = require('react-native');
    return { Button: Button };
});

jest.mock('../../components/popups/showCardsPopup', () => 'ShowCardsPopup');
jest.mock('../../components/popups/changeCardsPopup', () => 'ChangeCardsPopup');
jest.mock('../../components/popups/choosePlayerPopup', () => 'ChoosePlayerPopup');
jest.mock('../../components/popups/chooseCardFromPlayerPopup', () => 'ChooseCardFromPlayerPopup');


const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
};

let socketCallbacks = {};
mockSocket.on.mockImplementation((event, callback) => {
    socketCallbacks[event] = callback;
});

beforeEach(() => {
    jest.clearAllMocks();
    socketCallbacks = {};
});


describe('<GameScreen />', () => {

    const renderComponent = () => {
        return render(
            <SocketContext.Provider value={mockSocket}>
                <GameScreen navigation={mockNavigation} />
            </SocketContext.Provider>
        );
    };

    it('renders correctly with initial route params', () => {
        const { getByText } = renderComponent();

        // Check if Room Code and Nickname from route params are displayed
        expect(getByText('ROOM_123')).toBeTruthy();
        expect(getByText('TestPlayer')).toBeTruthy();
    });

    it('updates state when "refreshGame" socket event is received', async () => {
        const { getByTestId, queryByTestId } = renderComponent();

        // Verify Deck is not visible initially
        expect(queryByTestId('card-deck')).toBeNull();

        // Simulate Server sending data
        const mockDeck = 'deck_card_back';
        const mockThrown = 'ace_of_spades';
        const mockCards = { '0': { publicId: 'pid1', nickname: 'TestPlayer', hand: [] } };
        const mockTurn = [0, 30, 'pid1']; // index, time, publicId

        act(() => {
            // Trigger the callback captured in useEffect
            if (socketCallbacks['refreshGame']) {
                socketCallbacks['refreshGame'](
                    [], // animations
                    mockCards,
                    mockDeck,
                    mockThrown,
                    mockTurn
                );
            }
        });

        // Verify Deck and Thrown card appear
        expect(getByTestId(`card-${mockDeck}`)).toBeTruthy();
        expect(getByTestId(`card-${mockThrown}`)).toBeTruthy();
    });

    it('emits "takeCard" when the deck is pressed', () => {
        const { getByTestId } = renderComponent();

        // 1. Initialize data so Deck exists
        act(() => {
            if (socketCallbacks['refreshGame']) {
                socketCallbacks['refreshGame']( [], {}, 'back_blue', null, null);
            }
        });

        // 2. Press the deck
        const deck = getByTestId('card-back_blue');
        fireEvent.press(deck);

        // 3. Check socket emit
        expect(mockSocket.emit).toHaveBeenCalledWith('takeCard', 'ROOM_123');
    });

    it('handles selecting cards and throwing them', async () => {
        const { getByText } = renderComponent();

        // 1. Simulate game load
        act(() => {
            if (socketCallbacks['refreshGame']) {
                socketCallbacks['refreshGame']( [], { '0': { hand: [1, 2] } }, 'deck', null, null);
            }
        });

        // 2. Select a card via the mocked PlayerHand button
        const selectBtn = getByText('Select Card 1');
        fireEvent.press(selectBtn);

        // 3. The "Throw Selected Cards" button should now appear
        // Note: Button component from react-native usually has title as text
        const throwBtn = getByText('Throw Selected Cards');
        expect(throwBtn).toBeTruthy();

        // 4. Press Throw
        fireEvent.press(throwBtn);

        // 5. Verify emit
        expect(mockSocket.emit).toHaveBeenCalledWith('throwCard', 'ROOM_123', [1]);
    });

    it('prevents navigation back (BackHandler/Listener)', () => {
        // This tests the navigation.addListener call in useEffect
        renderComponent();

        expect(mockNavigation.addListener).toHaveBeenCalledWith(
            'beforeRemove',
            expect.any(Function)
        );
    });
});