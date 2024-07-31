import { Router } from "express";
import { fileValidation, uploadFile } from "../../utils/multer.js";
import * as jobController from "./controller/job.controller.js";
import * as jobValidator from "./job.validation.js";
import validation from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
import jobEndPoint from "./job.endPoint.js";

const router = Router();

router
	//addJob
	.post(
		"/",
		validation(jobValidator.tokenSchema, true),
		validation(jobValidator.CreateJobSchema),
		auth(jobEndPoint.create),
		jobController.addJob,
	)
	//applyToJob
	.post(
		"/applyToJob",
		validation(jobValidator.tokenSchema, true),
		uploadFile(fileValidation.pdf).single("CV"),
		validation(jobValidator.applyJobSchema),
		auth(jobEndPoint.all),
		jobController.applyToJob,
	)
	//updateJob
	.put(
		"/:jobId",
		validation(jobValidator.tokenSchema, true),
		validation(jobValidator.updateJobSchema),
		auth(jobEndPoint.update),
		jobController.updateJob,
	)
	//getJobWithCompany
	.get(
		"/getAll",
		validation(jobValidator.tokenSchema, true),
		auth(jobEndPoint.all),
		jobController.getJobWithCompany,
	)
	//getJobWithOneCompany
	.get(
		"/one",
		validation(jobValidator.tokenSchema, true),
		validation(jobValidator.getCompanyJobsSchema),
		auth(jobEndPoint.all),
		jobController.getJobWithOneCompany,
	)
	//getAllJobsFilter
	.get(
		"/",
		validation(jobValidator.tokenSchema, true),
		auth(jobEndPoint.all),
		jobController.getAllJobsFilter,
	)
	//deleteJob
	.delete(
		"/:jobId",
		validation(jobValidator.tokenSchema, true),
		validation(jobValidator.deleteJobSchema),
		auth(jobEndPoint.delete),
		jobController.deleteJob,
	)
	//softDeleteJob
	.patch(
		"/:jobId",
		validation(jobValidator.tokenSchema, true),
		validation(jobValidator.softDeleteJobSchema),
		auth(jobEndPoint.delete),
		jobController.softDeleteJob,
	);
export default router;
