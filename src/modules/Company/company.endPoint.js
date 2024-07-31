import { roles } from "../../middleware/auth.js";

const companyEndPoint = {
	create: [roles.Company_HR],
	update: [roles.Company_HR],
	all:[roles.Company_HR, roles.User],
};
export default companyEndPoint;
