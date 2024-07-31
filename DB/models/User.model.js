import { Schema, model } from "mongoose";

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			trim: true,
			required: [true, "First name must be a required value"],
			min: [2, "Too short first name"],
			max: [20, "Max length 20 for first name"],
			lowercase: true,
		},
		lastName: {
			type: String,
			trim: true,
			required: [true, "Last name must be a required value"],
			min: [2, "Too short last name"],
			max: [20, "Max length 20 for last name"],
			lowercase: true,
		},
		username: {
			type: String,
			trim: true,
			lowercase: true,
			// unique: [true, "Username must be unique"],
			// required: [true, "Username must be a required value"]
		},
		email: {
			type: String,
			required: true,
			unique: [true, "Email must be unique"],
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		recoveryEmail: {
			type: String,
			lowercase: true,
		},
		dob: {
			type: Date,
		
		},
		mobileNumber: {
			type: String,
			unique: [true, "Mobile number must be unique"],
		},
		role: {
			type: String,
			default: "Company_HR",
			enum: ["User", "Company_HR"],
		},
		status: {
			type: String,
			default: "Offline",
			enum: ["Offline", "Online"],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		confirmEmail: {
			type: Boolean,
			default: false,
		},
		code: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

// Pre-save hook to generate username based on firstName and lastName
userSchema.pre("save", function (next) {
	this.username = `${this.firstName.toLowerCase()}_${this.lastName.toLowerCase()}`;
	next();
});

const userModel = model("User", userSchema);

export default userModel;


