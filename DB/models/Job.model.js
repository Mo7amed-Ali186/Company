import { Schema, model } from "mongoose";

const jobSchema = new Schema(
	{
		jobTitle: {
			type: String,
			required: true,
			trim: true,
		},
		jobLocation: {
			type: String,
			default: "onsite",
			enum: ["onsite", "remotely", "hybrid"],
		},
		workingTime: {
			type: String,
			default: "part-time",
			enum: ["part-time", "full-time"],
		},
		seniorityLevel: {
			type: String,
			default: "Senior",
			enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
		},
		jobDescription: {
			type: String,
		},
technicalSkills: [{
			type: String,
		}],
softSkills: [{
			type: String,
		}],
		companyId: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: [true, "CompanyId is required"],
		},
		addedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		}
	},
	{
		timestamps: true,
	},
);

const jobModel = model("Job", jobSchema);

export default jobModel;
