export const Instructions = {
    move: (from, to, cardId) => ['move', from, to, cardId],
    discard: (cardId, publicId) =>
        publicId ? ['move', publicId, 'thrown', '0'] : ['move', 'hand', 'thrown', cardId],
    peekFuture: cards => ['peekFuture', cards],
    changeFuture: cards => ['changeFuture', cards],
};
