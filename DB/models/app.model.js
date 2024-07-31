import { Schema, model } from "mongoose";

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
userTechSkills: [{
        type: String,
        required: true,
    }],
    userSoftSkills: [{
        type: String,
        required: true,
    }],
    userResume: {
        type: Object, // Assuming you store the cloudinary URL for the PDF
        required: true,
    },
    // userResume: [{
    //     public_id: String,
    //     secure_url: String
    // }]
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
applicationSchema.virtual("User",{
    ref:"User",
    localField:"userId",
    foreignField:"_id"
})

const applicationModel = model("Application", applicationSchema);

export default applicationModel;
