export function toPublic(user) {
    const { passwordHash, ...rest } = user;
    return rest;
}
//# sourceMappingURL=user.model.js.map