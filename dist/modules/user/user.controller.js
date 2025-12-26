import { ApiError } from "../../utils/api-error.js";
export class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    list = async (_req, res, next) => {
        try {
            const users = await this.userService.list();
            return res.json({ data: users });
        }
        catch (err) {
            return next(err);
        }
    };
    create = async (req, res, next) => {
        try {
            const { email, password, role } = req.body ?? {};
            if (!email || !password)
                throw ApiError.badRequest("email and password are required");
            const user = await this.userService.create({ email, password, role });
            return res.status(201).json({ data: user });
        }
        catch (err) {
            return next(err);
        }
    };
    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id)
                throw ApiError.badRequest("id is required");
            const user = await this.userService.findById(id);
            if (!user)
                throw ApiError.notFound("User not found");
            return res.json({ data: user });
        }
        catch (err) {
            return next(err);
        }
    };
}
//# sourceMappingURL=user.controller.js.map