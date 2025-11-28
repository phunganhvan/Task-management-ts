"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordPost = exports.forgotPasswordPost = exports.loginPost = exports.registerPost = void 0;
const registerPost = (req, res, next) => {
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
exports.registerPost = registerPost;
const loginPost = (req, res, next) => {
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
exports.loginPost = loginPost;
const forgotPasswordPost = (req, res, next) => {
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
exports.forgotPasswordPost = forgotPasswordPost;
const resetPasswordPost = (req, res, next) => {
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
exports.resetPasswordPost = resetPasswordPost;
