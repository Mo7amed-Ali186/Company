import { roles } from "../../middleware/auth.js";

const userEndPoint = {
	create: [roles.Company_HR,roles.User],
	update: [roles.Company_HR,roles.User],
	delete: [roles.Company_HR,roles.User],
};
export default userEndPoint;
