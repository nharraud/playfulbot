export class RunningGameRepositoryInMemory {
    games = new Map();
    get nbGames() {
        return this.games.size;
    }
    get(id) {
        return this.games.get(id);
    }
    list() {
        return [...this.games.values()];
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
//# sourceMappingURL=RunningGameRepositoryInMemory.js.map