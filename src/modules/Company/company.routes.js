import { Router } from "express";
import * as companyController from "./controller/company.controller.js";
import * as companyValidation from "./company.validation.js";
import validation from "../../middleware/validation.js";
import companyEndPoint from "./company.endPoint.js";
import auth from "../../middleware/auth.js";
const router = Router();
router
    //addCompany
	.post(
		"/",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.companyCreateSchema),
		auth(companyEndPoint.create),
		companyController.addCompany,
	)
	//addCompany
	.put(
		"/:companyId",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.companyUpdateSchema),
		auth(companyEndPoint.create),
companyController.updateCompany,
	)
	//getCompany
	.get(
		"/getCompany/:companyId",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.getCompanySchema),
		auth(companyEndPoint.create),
		companyController.getCompany,
	)
	//softDelete
	.patch(
		"/:companyId",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.softDeleteCompanySchema),
		auth(companyEndPoint.create),
		companyController.softDelete,
	)
	//searchCompany
	.get(
		"/search",
		validation(companyValidation.tokenSchema, true),
		auth(companyEndPoint.all),
		companyController.searchCompany,
	)
	//allApplication
	.get(
		"/allApplication/:companyId",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.allApplicationSchema),
		auth(companyEndPoint.create),
		companyController.allApplication,
	)
	//deleteCompany
	.delete(
		"/:companyId",
		validation(companyValidation.tokenSchema, true),
		validation(companyValidation.deleteCompanySchema),
		auth(companyEndPoint.create),
		companyController.deleteCompany,
	);

export default router;
