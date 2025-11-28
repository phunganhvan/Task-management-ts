import { Request, Response } from "express";
import User from "../../../model/user.model"; 
import ForgotPassword from "../../../model/forgotPassword.model";
import * as sendMailHelper from "../../../helpers/sendMail";
import md5 from "md5";
import * as generateHelper from "../../../helpers/generate";

interface RegisterBody {
    fullName: string;
    email: string;
    password: string;
}

// [POST] /api/v1/users/register
export const register = async (
    req: Request<{}, {}, RegisterBody>,
    res: Response
): Promise<void> => {
    try {
        const { fullName, email, password } = req.body;

        // Kiểm tra email tồn tại
        const existEmail = await User.findOne({
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

        const hashedPassword = md5(password);

        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            token: generateHelper.generateRandomString(30),
        });

        await user.save();

        const token = user.token;

        res.cookie("token", token);

        res.json({
            code: 200,
            message: "Đăng kí tài khoản thành công",
            tokenUser: token,
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            code: 500,
            message: "Có lỗi xảy ra, vui lòng thử lại!"
        });
    }
};


// -------------------------
// LOGIN
// -------------------------
interface LoginBody {
    email: string;
    password: string;
}

export const login = async (
    req: Request<{}, {}, LoginBody>,
    res: Response
): Promise<void> => {
    const { email, password } = req.body;

    const hashedPassword = md5(password);

    const user = await User.findOne({ email, deleted: false });

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
};

// -------------------------
// FORGOT PASSWORD
// -------------------------
interface ForgotPasswordBody {
    email: string;
}

export const forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordBody>,
    res: Response
): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email, deleted: false });

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
        expiresAfter: Date.now(), // bạn có thể lưu thêm thời gian hết hạn
    };

    const forgotPassword = new ForgotPassword(objPassword);
    await forgotPassword.save();

    // Gửi email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
        Mã OTP để lấy lại mật khẩu là 
        <b style="color: green; font-size: 24px">${otp}</b>. 
        Thời hạn sử dụng là 2 phút. Vui lòng không chia sẻ với bất kì ai.
    `;

    await sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP xác nhận",
    });
};

// -------------------------
// OTP PASSWORD
// -------------------------
interface OtpPasswordBody {
    email: string;
    otp: string;
}

export const otpPassword = async (
    req: Request<{}, {}, OtpPasswordBody>,
    res: Response
): Promise<void> => {
    const { email, otp } = req.body;

    const result = await ForgotPassword.findOne({ email, otp });

    if (!result) {
        res.status(400).json({
            code: 400,
            message: "Mã OTP không hợp lệ",
        });
        return;
    }

    const user = await User.findOne({ email, deleted: false });

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
};

// -------------------------
// RESET PASSWORD
// -------------------------
interface ResetPasswordBody {
    password: string;
}

export const resetPassword = async (
    req: Request<{}, {}, ResetPasswordBody>,
    res: Response
): Promise<void> => {
    const token = req.cookies.token;
    const hashedPassword = md5(req.body.password);

    const user = await User.findOne({ token });

    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Không tìm thấy tài khoản",
        });
        return;
    }

    await User.updateOne(
        { token },
        { password: hashedPassword }
    );

    res.json({
        code: 200,
        message: "Đặt lại mật khẩu thành công",
    });
};

// -------------------------
// DETAIL
// -------------------------
export const detail = async (req: Request, res: Response): Promise<void> => {
    try {
        res.json({
            code: 200,
            message: "Trang cá nhân",
            infoUser: (req as any).user,
        });
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Đã có lỗi xảy ra",
        });
    }
};

// -------------------------
// LIST USERS
// -------------------------
export const list = async (req: Request, res: Response): Promise<void> => {
    const users = await User.find({
        deleted: false
    }).select("fullName email avatar");

    res.json({
        code: 200,
        message: "Thành công",
        users,
    });
};