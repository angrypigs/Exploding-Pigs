export class Room {
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

    get_player_list() {
        const list = [];
        for (const [id, player] of this.players.entries()) {
            list.push({ id, nickname: player.nickname });
        }
        return list;
    }
}