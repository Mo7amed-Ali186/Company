import { Schema, model } from "mongoose";
const companySchema = new Schema(
	{
		companyName: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			min: [2, "Too short company name"],
			max: [20, "Max length 20 for company name"],
			lowerCase: true,
		},
		description: {
			type: String,
			min: [20, "Too short description "],
			max: [200, "Max length 20 for description"],
		},
		industry: {
			type: String,
			min: [2, "Too short industry name"],
			max: [20, "Max length 20 for industry name"],
			lowerCase: true,
		},
		address: {
			type: String,
			min: [20, "Too short address "],
			max: [200, "Max length 20 for address"],
		},
		numberOfEmployees: {
			type: Number,
			min: 1,
			max: 23,
		},
		companyEmail: {
			type: String,
			required: true,
			unique: true,
		},
		companyHR: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true, //change true when create hr
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);
companySchema.virtual("Job", {
	ref: "Job",
	localField: "_id",
	foreignField: "companyId",
});
const companyModel = model("Company", companySchema);
export default companyModel;
