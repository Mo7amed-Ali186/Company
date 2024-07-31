import { globalError } from "./utils/errorHandler.js";
import { connection } from "../DB/connection.js";
import authRouter from "./modules/auth/auth.routes.js";
import jobRouter from "./modules/Jobs/job.routes.js";
import companyRouter from "./modules/Company/company.routes.js";
import userRouter from "./modules/User/user.routes.js";
export function bootstrap(app, express) {
	connection();
	app.use(express.json());
	app.use("/uploads", express.static("uploads"));
	app.use("/auth", authRouter);
	app.use("/job", jobRouter);
	app.use("/user", userRouter);
	app.use("/company", companyRouter);
	app.use("*", (req, res, next) => {
		return res.json({ message: "Invalid Request" });
	});
	app.use(globalError);
}
