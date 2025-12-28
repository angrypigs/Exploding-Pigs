export const Instructions = {
    move: (from, to, cardId) => ['move', from, to, cardId],
    discard: (cardId, publicId) =>
        publicId ? ['move', publicId, 'thrown', '0'] : ['move', 'hand', 'thrown', cardId],
    peekFuture: cards => ['popup', 'peekFuture', cards],
    changeFuture: cards => ['popup', 'changeFuture', cards],
    choosePlayerSniper: () => ['popup', 'choosePlayerSniper'],
    choosePlayerFavor: () => ['popup', 'choosePlayerFavor'],
    chooseCardFavor: () => ['popup', 'chooseCardFavor'],
};
