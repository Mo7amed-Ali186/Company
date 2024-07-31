import joi from 'joi';
import { generalFields } from '../../utils/generalFields.js';

export const userUpdateSchema = joi.object({
    // userId: generalFields.id.required(),
    firstName:joi.string().min(2).max(20),
    lastName:joi.string().min(2).max(20),
    username:joi.string().min(2).max(20),
    email:generalFields.email,
    recoveryEmail:generalFields.email,
    mobileNumber:joi.string(),
    role:joi.string(),
    dob: joi.string().pattern(new RegExp(/^\d{4}-\d{1,2}-\d{1,2}$/)),
}).required();
export const deleteSchema = joi.object({
    email:generalFields.email,
}).required()
export const userAccountDataSchema = joi.object({
    email:generalFields.email,
}).required()
export const profileDataSchema = joi.object({
    email:generalFields.email,
    userId: generalFields._id,
}).required()
export const accountSchema = joi.object({
    recoveryEmail:generalFields.email,
}).required()
export const tokenSchema = joi.object({
    authorization:joi.string().required()
}).required()



