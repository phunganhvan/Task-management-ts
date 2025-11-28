"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.detail = exports.resetPassword = exports.otpPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../model/user.model"));
const forgotPassword_model_1 = __importDefault(require("../../../model/forgotPassword.model"));
const sendMailHelper = __importStar(require("../../../helpers/sendMail"));
const md5_1 = __importDefault(require("md5"));
const generateHelper = __importStar(require("../../../helpers/generate"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, password } = req.body;
        const existEmail = yield user_model_1.default.findOne({
            email,
            deleted: false
        });
        if (existEmail) {
            res.status(400).json({
                code: 400,
                message: "Email đã tồn tại"
            });
            return;
        }
        const hashedPassword = (0, md5_1.default)(password);
        const user = new user_model_1.default({
            fullName,
            email,
            password: hashedPassword,
            token: generateHelper.generateRandomString(30),
        });
        yield user.save();
        const token = user.token;
        res.cookie("token", token);
        res.json({
            code: 200,
            message: "Đăng kí tài khoản thành công",
            tokenUser: token,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            code: 500,
            message: "Có lỗi xảy ra, vui lòng thử lại!"
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hashedPassword = (0, md5_1.default)(password);
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }
    if (hashedPassword !== user.password) {
        res.status(400).json({
            code: 400,
            message: "Sai mật khẩu",
        });
        return;
    }
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token,
    });
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }
    const otp = generateHelper.generateRandomOtp(6);
    const objPassword = {
        email,
        otp,
        expiresAfter: Date.now(),
    };
    const forgotPassword = new forgotPassword_model_1.default(objPassword);
    yield forgotPassword.save();
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là 
        <b style="color: green; font-size: 24px">${otp}</b>. 
        Thời hạn sử dụng là 2 phút. Vui lòng không chia sẻ với bất kì ai.
    `;
    yield sendMailHelper.sendMail(email, subject, html);
    res.json({
        code: 200,
        message: "Đã gửi mã OTP xác nhận",
    });
});
exports.forgotPassword = forgotPassword;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield forgotPassword_model_1.default.findOne({ email, otp });
    if (!result) {
        res.status(400).json({
            code: 400,
            message: "Mã OTP không hợp lệ",
        });
        return;
    }
    const user = yield user_model_1.default.findOne({ email, deleted: false });
    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Không tìm thấy tài khoản",
        });
        return;
    }
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Xác thực thành công",
        token,
    });
});
exports.otpPassword = otpPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    const hashedPassword = (0, md5_1.default)(req.body.password);
    const user = yield user_model_1.default.findOne({ token });
    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Không tìm thấy tài khoản",
        });
        return;
    }
    yield user_model_1.default.updateOne({ token }, { password: hashedPassword });
    res.json({
        code: 200,
        message: "Đặt lại mật khẩu thành công",
    });
});
exports.resetPassword = resetPassword;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json({
            code: 200,
            message: "Trang cá nhân",
            infoUser: req.user,
        });
    }
    catch (error) {
        res.status(400).json({
            code: 400,
            message: "Đã có lỗi xảy ra",
        });
    }
});
exports.detail = detail;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({
        deleted: false
    }).select("fullName email avatar");
    res.json({
        code: 200,
        message: "Thành công",
        users,
    });
});
exports.list = list;
