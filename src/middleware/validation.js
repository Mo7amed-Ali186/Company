const validation = (schema, includeToken = false) => {
	return (req, res, next) => {
		try {
			let methods = { ...req.body, ...req.params, ...req.query };

			if (req.file) {
				methods.file = req.file;
			}
			if (req.files) {
				methods.files = req.files;
			}
			if (req.headers.authorization && includeToken) {
				methods = { authorization: req.headers.authorization };
			}
			const validationResult = schema.validate(methods, { abortEarly: false });
			if (validationResult.error) {
				req.validationResult = validationResult.error;
				return next(new Error("validation error", { cause: 403 }));
			}
			return next();
		} catch (error) {
			return res.status(500).json({
				message: error.message,
				stack: error.stack,
			});
		}
	};
};
export default validation;
