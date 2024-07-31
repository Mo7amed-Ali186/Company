import companyModel from "../../../../DB/models/Company.model.js";
import jobModel from "../../../../DB/models/Job.model.js";
import userModel from "../../../../DB/models/User.model.js";
import applicationModel from "../../../../DB/models/app.model.js";
import { ApiFeatures } from "../../../utils/apiFetuers.js";
import { asyncHandler } from "../../../utils/errorHandler.js";

export const addCompany = asyncHandler(async (req, res, next) => {
	const { companyName, companyEmail } = req.body;
	const { _id } = req.user;
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("user not found", { cause: 404 }));
	}
	//  Check if name exists
	if (
		await companyModel.findOne({
			$or: [{ companyName }, { companyEmail }],
			isDeleted: false,
		})
	) {
		return next(new Error("Name already exists", { cause: 409 }));
	}
	req.body.companyHR = req.user._id;
	//create company
	const company = await companyModel.create(req.body);
	return res.status(201).json({ message: "Done", company });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
	const { companyName ,companyEmail } = req.body;
	const { companyId } = req.params;
	const { _id } = req.user;
	// Check if the companyName or companyEmail already exists
	if (await companyModel.findOne({$or: [{ companyName},{ companyEmail },],isDeleted: false,})) {
		return next(
			new Error("companyName or companyEmail already exists ", { cause: 409 }),
		);
	}
	// Check if the company Id exists
	const company = await companyModel.findById(companyId);
	if (!company) {
		return next(new Error("Company not found", { status: 404 }));
	}
	//  Check if user auth exists
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("User not found", { cause: 404 }));
	}
	// Check if the user making the request is the owner of the company
	if (String(company.companyHR) !== String(_id)) {
		return next(
			new Error("You are not authorized to update this job", { cause: 403 }),
		);
	}

	// Update the company data
	const updatedCompany = await companyModel.findByIdAndUpdate(
		companyId,
		req.body,
		{ new: true },
	);

	return res.status(201).json({ message: "Done", company: updatedCompany });
});

//getCompany by id
export const getCompany = asyncHandler(async (req, res, next) => {
	const { companyId } = req.params;
	const { _id } = req.user;
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("user not found", { cause: 404 }));
	}
	const company = await companyModel.findById({ _id: companyId }).populate([
		{
			path: "Job",
		},
	]);
	if (!company) {
		return next(new Error("company not found", { cause: 404 }));
	}
	return res.status(201).json({ message: "Done", company });
});

// Soft Delete company Account (user must be logged in by token)
export const softDelete = async (req, res, next) => {
	const { companyId } = req.params;
	const { _id } = req.user;
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("user not found", { cause: 404 }));
	}
	const companyDelete = await companyModel.findById({ _id: companyId });

	if (!companyDelete) {
		return next(new Error("User not found"));
	}

	if (companyDelete.isDeleted) {
		return next(new Error("User account is already soft-deleted"));
	}
	companyDelete.isDeleted = true;
	await companyDelete.save();
	return res.status(201).json({ message: "Done" });
};
//Search for a company with a companyName
export const searchCompany = asyncHandler(async (req, res, next) => {

	// Create a new instance of ApiFeatures
    const apiFeatures = new ApiFeatures(companyModel.find(), req.query).search()

	// Execute the query and retrieve the results
	const companies = await apiFeatures.mongooseQuery;
	if (companies.length === 0) {
        return res.status(404).json({ message: "Company not found" });
    }

	return res.status(200).json({ message: "Success", data: companies });
	
});

//deleteCompany
export const deleteCompany = asyncHandler(async (req, res, next) => {
	const { companyId } = req.params;
	// Check if company exists
	const company = await companyModel.findById(companyId);
	if (!company) {
		return next(new Error("Company not found", { status: 404 }));
	}
	// Check if the user making the request is the owner of the company
	if (String(company.companyHR) !== String(_id)) {
		return next(
			new Error("You are not authorized to update this company", { cause: 403 }),
		);
	}
	// Allow the deletion if the user is the owner
	await companyModel.findByIdAndDelete(companyId);
	return res.status(201).json({ message: "Done" });
});

//1-get jobId in params
//2-check if job exists -->
//3-check company owner must be get the application who create the job with yourSelf
//4-get all application for specific job
export const allApplication =asyncHandler(
	async (req, res, next) => {
        const { companyId } = req.params;

        const jobsFound = await jobModel.find({ companyId });
        if (!jobsFound.length) {
            return next(new Error("Jobs not found", { cause: 404 }));
        }


        if (String(jobsFound[0].addedBy) !== String(req.user._id)) {
            return next(new Error('Unauthorized Access For This Company_HR', { cause: 401 }));
        }

        const applications = await applicationModel.find({ jobId: { $in: jobsFound.map(job => job._id) } })
            .populate([
                {
                    path:'User'
                }
            ]); // Populate the 'user' field

        return res.status(200).json({ message: "Done", applications });
    }
 )

