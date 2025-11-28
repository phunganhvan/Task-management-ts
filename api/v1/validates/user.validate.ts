import { Request, Response, NextFunction } from "express";

export const registerPost = (req: Request, res: Response, next: NextFunction): void => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập đủ thông tin"
        });
        return;
    }

    next();
};

export const loginPost = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập đủ thông tin"
        });
        return;
    }

    next();
};

export const forgotPasswordPost = (req: Request, res: Response, next: NextFunction): void => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập email"
        });
        return;
    }

    next();
};

export const resetPasswordPost = (req: Request, res: Response, next: NextFunction): void => {
    const { password, confirmPassword } = req.body;

    if (!password) {
        res.status(400).json({
            code: 400,
            message: "Vui lòng nhập mật khẩu"
        });
        return;
    }

    if (!confirmPassword) {
        res.status(400).json({
            code: 400,
            message: "Vui lòng xác nhận mật khẩu"
        });
        return;
    }

    if (password !== confirmPassword) {
        res.status(400).json({
            code: 400,
            message: "Mật khẩu không trùng khớp. Vui lòng kiểm tra lại!"
        });
        return;
    }

    next();
};
