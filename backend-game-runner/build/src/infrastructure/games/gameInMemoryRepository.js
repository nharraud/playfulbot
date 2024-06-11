export class GameInMemoryRepository {
    games = new Map();
    get(id) {
        return this.games.get(id);
    }
    add(game) {
        this.games.set(game.id, game);
    }
    delete(id) {
        this.games.delete(id);
    }
    clear() {
        this.games.clear();
    }
}
//# sourceMappingURL=gameInMemoryRepository.js.map