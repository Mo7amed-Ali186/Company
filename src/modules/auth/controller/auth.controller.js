import { compare } from "bcrypt";
import userModel from "../../../../DB/models/User.model.js";
import { sendEmail } from "../../../utils/Email.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import {
	generateToken,
	verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import {
	comparePassword,
	hashPassword,
} from "../../../utils/hashAndCompare.js";
import { customAlphabet } from "nanoid";

/* create signup contain 
gain data ,
check if email exist ,
create token & refresh token and send link,
send Email,
hash password 
create user*/

export const signUp = asyncHandler(async (req, res, next) => {
	const { email, mobileNumber } = req.body;
	// Check if email already exists
	const emailExists = await userModel.findOne({
		$or: [{ email }, { mobileNumber }],
		isDeleted: false,
	});
	if (emailExists) {
		return next(
			new Error("Email or mobileNumber already exists ", { cause: 409 }),
		);
	}
	// Create token and refresh token
	const token = generateToken({
		payload: { email },
		signature: process.env.SIGN_UP_SIGNATURE,
		expiresIn: 60 * 30,
	});
	const rf_token = generateToken({
		payload: { email },
		signature: process.env.SIGN_UP_SIGNATURE,
		expiresIn: 60 * 60 * 24,
	});

	const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
	const rf_link = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rf_token}`;
	// Send email
	const html = `
		<a href ='${link}'>confirm email</a>
		<br/>
		<br/>
		<a href ='${rf_link}'>refresh email</a>
		`;

	if (!sendEmail({ to: email, subject: "Message of confirm email", html })) {
		return next(new Error("Invalid Email", { cause: 404 }));
	}
	// Hash password
	req.body.password = hashPassword({ plaintext: req.body.password });
	const newUser = await userModel.create(req.body);
	return res.status(201).json({ message: "Done", user: newUser });
});
/*
1-get emailOrMobileNumber and password
2-check if emailOrMobileNumber exist
3-check if emailOrMobileNumber confirmed
4-compare password
5-generate token and refresh token
6-update status of user
*/
export const logIn = asyncHandler(async (req, res, next) => {
	const { emailOrMobileNumber, password } = req.body;

	// Check if the user exists with the provided email or mobile number
	const user = await userModel.findOne({
		$or: [
			{ email: emailOrMobileNumber },
			{ mobileNumber: emailOrMobileNumber },
		],
		isDeleted: false,
	});

	if (!user) {
		return next(
			new Error("Invalid email/mobile number or password or Deleted", {
				cause: 400,
			}),
		);
	}

	if (!user.confirmEmail) {
		return next(new Error("Please confirm your email first", { cause: 400 }));
	}

	// Check if the provided password is valid
	if (!comparePassword({ plaintext: password, hashValue: user.password })) {
		return next(
			new Error("Invalid email/mobile number or password", { cause: 400 }),
		);
	}
	// Generate tokens for authentication
	const token = generateToken({
		payload: { email: user.email, id: user._id },
		signature: process.env.TOKEN_SIGNATURE,
		expiresIn: 60 * 30,
	});
	const rfToken = generateToken({
		payload: { email: user.email, id: user._id },
		signature: process.env.TOKEN_SIGNATURE,
		expiresIn: 60 * 60 * 24 * 30,
	});
	// Update user status to "Online"
	await userModel.updateMany(
		{ email: user.email },
		{ status: "Online" },
		{ new: true },
	);
	return res.json({ message: "Sign In successful", token, rfToken });
});
/*
1-get token from params
2-verify token
3-check if email exist
4-check if user confirmed or not --> login
5-create token and newLink to confirmEmail
6-send email --> redirect to page
*/
export const confirmEmail = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { email } = verifyToken({
		token,
		signature: process.env.SIGN_UP_SIGNATURE,
	});

	if (!email) {
		return res.redirect("https://www.google.com.eg/?hl=ar"); //signup
	}

	const user = await userModel.findOne({ email });

	if (!user) {
		return res.redirect("https://www.google.com.eg/?hl=ar"); //sign
	}

	if (user.confirmEmail) {
		return res.redirect("https://www.youtube.com/"); //page login
	}

	await userModel.updateMany({ email }, { confirmEmail: true });
	return res.redirect("https://www.youtube.com/");
});

/*
1-get token from params
2-verify token
3-check if email exist
4-check if user confirmed or not --> login
5-create token and newLink to confirmEmail
6-send email --> redirect to page
*/
export const refreshToken = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { email } = verifyToken({
		token,
		signature: process.env.SIGN_UP_SIGNATURE,
	});
	if (!email) {
		return res.redirect("https://www.google.com.eg/?hl=ar");
	}
	const user = await userModel.findOne({ email });
	if (!user) {
		return res.redirect("https://www.google.com.eg/?hl=ar");
	}
	if (user.confirmEmail) {
		return res.redirect("https://www.youtube.com/");
	}
	const newToken = generateToken({
		payload: { email },
		signature: process.env.SIGN_UP_SIGNATURE,
		expiresIn: 60 * 10,
	});
	const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
	const html = `
    <a href ='${link}'>confirm email</a>
    <br/>
    `;
	if (!sendEmail({ to: email, subject: "confirm Email", html })) {
		return next(new Error("Invalid Email", { cause: 404 })); //redirect to front
	}

	return res.send("<h1>check email</h1>");
});
/*
1-get mail
2-if email exists
3-if confirmEmail
4-create code unique
5-update user by new code
*/
export const sendCode = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	const emailExists = await userModel.findOne({ email, isDeleted: false });
	if (!emailExists) {
		return next(new Error("email not exist or Deleted", { cause: 404 }));
	}
	if (!emailExists.confirmEmail) {
		return next(new Error("please confirm email", { cause: 400 }));
	}
	const nanoid = customAlphabet("0123456789", 5);
	const code = nanoid();
	if (
		!sendEmail({
			to: email,
			subject: "forget password",
			html: `<p>${code}</p>`,
		})
	) {
		return next(new Error("fail to send email", { cause: 400 }));
	}
	await userModel.updateOne({ email }, { code });
	return res.status(200).json({ message: "check your email" });
});
//1-get email and code
//2- check email exists
//3-check code exists
//4- password -->hash -->update user (password ,code,.....)
export const forgetPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.params;
	const { code, password } = req.body;
	const user = await userModel.findOne({ email, isDeleted: false });
	if (!user) {
		return next(new Error("user not exist or Deleted", { cause: 404 }));
	}
	if (code != user.code) {
		return next(new Error("invalid code", { cause: 404 }));
	}
	const newPassword = hashPassword({ plaintext: password });
	await userModel.updateOne(
		{ email },
		{ password: newPassword, code: null, status: "Offline" },
	);
	return res.status(200).json({ message: "Done" });
});

//Update password
//1-email, newPassword ,oldPassword
//2- check email exists
//3-check oldPassword by comparePassword
//4- newPassword -->hash -->update password
export const updatePassword = asyncHandler(async (req, res, next) => {
	const { email, newPassword, oldPassword } = req.body;
	const user = await userModel.findOne({ email, isDeleted: false });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	if (!comparePassword({ plaintext: oldPassword, hashValue: user.password })) {
		return next(new Error("wrong old password", { cause: 404 }));
	}
	const changePassword = hashPassword({ plaintext: newPassword });
	user.password = changePassword;
	await user.save();
	return res.status(201).json({ message: "Password updated successfully" });
});
