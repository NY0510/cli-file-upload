const express = require("express");
const app = express();
const fs = require("fs");
const expressErrorHandler = require("express-error-handler");

// Env Confg Values
require("dotenv").config();
const uploadFolder = process.env.UPLOAD_FOLDER;
const port = process.env.PORT;

!fs.existsSync(uploadFolder) && fs.mkdirSync(uploadFolder);

const errorHander = expressErrorHandler({
	static: {
		404: "./public/404.html",
		403: "./public/403.html",
	},
});

// Routes
app.use("/", require("./routers/main"));

app.use(expressErrorHandler.httpError(404, 403));
app.use(errorHander);

// Security Confg
app.disable("x-powered-by");

app.listen(port, function () {
	console.log("server on! http://localhost:" + port);
});
