import { ApiFeatures } from "../../../utils/apiFetuers.js";
import { asyncHandler } from "../../../utils/errorHandler.js";
import companyModel from "../../../../DB/models/Company.model.js";
import jobModel from "../../../../DB/models/Job.model.js";
import userModel from "../../../../DB/models/User.model.js";
import applicationModel from "../../../../DB/models/app.model.js";
import cloudinary from "../../../utils/cloudinary.js";

//add job by company---------V OK
export const addJob = asyncHandler(async (req, res, next) => {
	const { companyId } = req.body;
	const { _id } = req.user;
	const user = await userModel.findOne({ _id, isDeleted: false });
	if (!user) {
		return next(new Error("user not found", { cause: 404 }));
	}
	// Check if Company exists and is not deleted
	const foundCompany = await companyModel.findOne({
		_id: companyId,
		isDeleted: false,
	});

	if (!foundCompany) {
		return next(new Error("Company Not Found or Deleted", { cause: 404 }));
	}
	req.body.addedBy = req.user._id;
	// Create a new job
	const newJob = await jobModel.create(req.body);

	return res.status(201).json({ message: "Done", job: newJob });
});
// update job by company---------V OK
export const updateJob = asyncHandler(async (req, res, next) => {
	const { jobId } = req.params;
	// Check if job exists
	const job = await jobModel.findOne({ _id: jobId, isDeleted: false });
	if (!job) {
		return next(new Error("Job Not Found or Deleted", { cause: 404 }));
	}

	// Ensure that the user is authorized to update this job
	if (String(job.addedBy) !== String(req.user._id)) {
		return next(
			new Error("You are not authorized to update this job", { cause: 403 }),
		);
	}
	// Update the job
	const updatedJob = await jobModel.findByIdAndUpdate(
		{ _id: jobId },
		req.body,
		{ new: true },
	);
	return res.status(201).json({ message: "Done", job: updatedJob });
});
// delete job in the company---------V OK
export const deleteJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const { jobTitle } = req.body;

    // Check if both jobId and jobTitle are not provided
    if (!jobId && !jobTitle) {
        return next(new Error("Please provide either jobId or jobTitle to delete the job", { status: 400 }));
    }

    // Find the job by either jobId or jobTitle
    const job = await jobModel.findOne({ $or: [{ _id: jobId }, { jobTitle }] });

    // Check if the job is found
    if (!job) {
        return next(new Error("Job not found", { status: 404 }));
    }

    // Check if the user making the request is the owner of the job
    if (String(job.addedBy) !== String(req.user._id)) {
        return next(new Error("You are not authorized to delete this job", { status: 403 }));
    }

    // Allow the deletion if the user is the owner
    await jobModel.findByIdAndDelete(job._id);
    return res.status(200).json({ message: "Job deleted successfully" });
});

//Get all Jobs with their company’s information.---------V OK
export const getJobWithCompany = asyncHandler(async (req, res, next) => {
	const job = await jobModel.find().populate([
		{
			path: "companyId",
		},
	]);
	if (!job) {
		return next(new Error("company not found", { cause: 404 }));
	}
	return res.status(200).json({ message: "Done", job });
});
//Get all Jobs for a specific company.---------V OK
export const getJobWithOneCompany = asyncHandler(async (req, res, next) => {
	const { companyName } = req.query;
	// Check if Company exists and is not deleted
	const foundCompany = await companyModel.findOne({
		companyName,
		isDeleted: false,
	});
	if (!foundCompany) {
		return next(new Error("Company Not Found or Deleted", { cause: 404 }));
	}
	// Find all jobs for the specific company
	const companyJobs = await jobModel.find({ companyId: foundCompany._id });
	return res.status(200).json({ message: "Done", jobs: companyJobs });
});
//getAllJobsFilter---------V OK
export const getAllJobsFilter = asyncHandler(async (req, res) => {
	// Construct the base MongoDB query
	const baseQuery = jobModel.find();

	// Create an instance of ApiFeatures with the base query and filter criteria
	const apiFeatures = new ApiFeatures(baseQuery, req.query)
		// .search() // Apply search filter
		.filter() // Apply other filters
		// .paginate() // Apply pagination if needed
		// .sort(); // Apply sorting if needed

	// Execute the MongoDB query to retrieve the matching jobs
	const jobs = await apiFeatures.mongooseQuery;
	// Send the response with the retrieved jobs
	res.status(200).json({ success: true, count: jobs.length, data: jobs });
});
//applyToJob---------V OK
export const applyToJob = asyncHandler(async (req, res, next) => {
	// Find the job based on the jobTitle provided in the request body
	const job = await jobModel.findOne({ _id: req.body.jobId });

	// If the job is not found, return a 404 error
	if (!job) {
		return next(new Error("Job Not Found", { cause: 404 }));
	}

	const existingApplication = await applicationModel.findOne({ userId: req.user._id, jobId: req.body.jobId });
	if (existingApplication) {
		return next(new Error("Already applied to this job", { cause: 409 }));
	}
	// Upload the resume PDF file to Cloudinary
	const { secure_url, public_id } = await cloudinary.uploader.upload(
		req.file.path,
		{ folder: `${process.env.APP_NAME}/Application` },
	);

	// If the PDF upload fails, return a 400 error
	if (!secure_url) {
		return next(new Error("Pdf not found", { cause: 400 }));
	}

	// Add the public_id and secure_url of the uploaded PDF to the request body
	req.body.userResume = { public_id, secure_url };
	req.body.userId = req.user._id;
	// Create a new application using the request body data
	const createApplication = await applicationModel.create(req.body);
	// Send a success response with the created application data
	return res
		.status(201)
		.json({ message: "Done", Application: createApplication });
});
//softDeleteJob---------V OK
export const softDeleteJob = asyncHandler(async (req, res, next) => {
	const { jobId } = req.params;
	const job = await jobModel.findOne({ _id: jobId });
	if (!job) {
		return next(new Error("job Not Found", { cause: 404 }));
	}
	if (job.isDeleted) {
		return res.status(200).json({ message: "job Already Soft Deleted" });
	}
	job.isDeleted = true;
	await job.save();
	return res.status(200).json({ message: "Done" });
});
