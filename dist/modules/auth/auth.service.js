function randomTokenId() {
    return crypto.randomUUID();
}
export class AuthService {
    userDb;
    authDb;
    constructor(userDb, authDb) {
        this.userDb = userDb;
        this.authDb = authDb;
    }
    async login(input) { }
    async refresh() { }
    async logout() { }
}
//# sourceMappingURL=auth.service.js.map