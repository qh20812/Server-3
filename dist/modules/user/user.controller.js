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
    register = async (req, res, next) => {
        try {
            const { email, password, role } = req.body ?? {};
            if (!email || !password)
                throw ApiError.badRequest("email and password are required");
            await this.userService.register({ email, password, role });
            return res.status(201).json({ message: "User registered" });
        }
        catch (err) {
            return next(err);
        }
    };
    getByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            if (!email)
                throw ApiError.badRequest("email is required");
            const user = await this.userService.findByEmail(email);
            if (!user)
                throw ApiError.notFound("User not found");
            return res.json({ data: user });
        }
        catch (err) {
            return next(err);
        }
    };
    updateById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id)
                throw ApiError.badRequest("id is required");
            const { email, password, role } = req.body ?? {};
            const updated = await this.userService.updateById(id, { email, password, role });
            return res.json({ data: updated });
        }
        catch (err) {
            return next(err);
        }
    };
    deleteById = async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id)
                throw ApiError.badRequest("id is required");
            await this.userService.deleteById(id);
            return res.status(204).send();
        }
        catch (err) {
            return next(err);
        }
    };
}
//# sourceMappingURL=user.controller.js.map