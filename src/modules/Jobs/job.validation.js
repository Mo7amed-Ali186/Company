import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const CreateJobSchema = joi
	.object({
		jobTitle: joi.string().min(2).max(40).required(),
		jobDescription: joi.string().min(30).max(800),
		jobLocation: joi.string().required(),
		seniorityLevel: joi.string().min(2).max(20).required(),
		workingTime: joi.string().min(2).max(20).required(),
		technicalSkills: joi.array(),
		softSkills: joi.array(),
		companyId: generalFields.id.required(),
	})
	.required();

export const updateJobSchema = joi
	.object({
		jobId: generalFields.id.required(),
		jobTitle: joi.string().min(2).max(40),
		jobDescription: joi.string().min(30).max(800),
		jobLocation: joi.string(),
		seniorityLevel: joi.string().min(2).max(20),
		workingTime: joi.string().min(2).max(20),
		technicalSkills: joi.array(),
		softSkills: joi.array(),
	})
	.required();

export const deleteJobSchema = joi
	.object({
		jobId: generalFields.id,
		jobTitle: joi.string().min(2).max(40),
	})
	.required();

export const applyJobSchema = joi
	.object({
		jobId: generalFields.id.required(),
		jobTitle: joi.string().min(2).max(40).required(),
		userSoftSkills: joi.string().required(), // Validate as array of strings
		userTechSkills: joi.string().required(),
		file: generalFields.file.required(),
	})
	.required();
	export const getCompanyJobsSchema = joi
	.object({
		companyName: joi.string().min(1).max(20),
	})
	.required();
export const tokenSchema = joi
	.object({
		authorization: joi.string().required(),
	})
	.required();
	export const softDeleteJobSchema = joi
	.object({
		jobId: generalFields.id,
	})
	.required();