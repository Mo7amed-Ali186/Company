import { roles } from "../../middleware/auth.js";

const jobEndPoint = {
	create: [roles.Company_HR],
	update: [roles.Company_HR],
	delete: [roles.Company_HR],
all:[roles.User,roles.Company_HR],

};
export default jobEndPoint;
