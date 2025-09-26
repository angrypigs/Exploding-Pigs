class Room {
    constructor(max_players) {
        this.max_players = max_players;
        this.players = new Map();
    }

    add_player(id, nickname, name) {
        if (this.players.size < this.max_players) {
            this.players.set(id, {
                nickname: nickname,
                name: name
            });
            return true;
        }
        else return false;
    }
}

module.exports = { Room };