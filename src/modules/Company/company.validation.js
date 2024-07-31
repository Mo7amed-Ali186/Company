import joi from "joi";
import { generalFields } from "../../utils/generalFields.js";

export const companyCreateSchema = joi
	.object({
		companyName: joi.string().min(2).max(20).required(),
		description: joi.string().min(30).max(200),
		address: joi.string().min(30).max(200),
		industry: joi.string().min(2).max(20).required(),
        numberOfEmployees: joi.string().min(1).max(20).required(),
		companyEmail: generalFields.email.required(),
	}).required();

	export const companyUpdateSchema = joi
	.object({
		companyId:generalFields.id,
		companyName: joi.string().min(2).max(20),
		description: joi.string().min(30).max(200),
		address: joi.string().min(30).max(200),
		industry: joi.string().min(2).max(20),
        numberOfEmployees: joi.string().min(1).max(20),
		companyEmail: generalFields.email,
	}).required();

	export const deleteCompanySchema = joi
	.object({
		companyId:generalFields.id,
	}).required();

	export const allApplicationSchema = joi
	.object({
		companyId:generalFields.id,
	}).required();

	export const getCompanySchema = joi
	.object({
		companyId:generalFields.id,
	}).required();

	export const tokenSchema = joi
	.object({
		authorization: joi.string().required(),
	})
	.required();

	export const softDeleteCompanySchema = joi
	.object({
		jobId: generalFields.id,
	})
	.required();