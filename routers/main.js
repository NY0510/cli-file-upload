const express = require("express");
const router = express.Router();

const multer = require("multer");
const crypto = require("crypto");
const logger = require("log4js").getLogger("app");

require("dotenv").config();
const uploadFolder = process.env.UPLOAD_FOLDER;
const maxUploadSize = process.env.MAX_UPLOAD_SIZE * 1000 * 1000;
const baseURL = `${process.env.BASE_URL}:${process.env.PORT}`;

const uploaderWithNameStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadFolder);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
});
const uploaderWithRandomNameStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadFolder);
	},
	filename: (req, file, cb) => {
		let customFileName = crypto.randomBytes(18).toString("hex"),
			fileExtension = file.originalname.split(".")[1]; // 확장자 추출
		if (fileExtension) {
			cb(null, customFileName + "." + fileExtension);
		} else {
			cb(null, customFileName);
		}
	},
});
const uploaderWithName = multer({ storage: uploaderWithNameStorage, limits: { fileSize: maxUploadSize } }).array("file");
const uploaderWithRandomName = multer({ storage: uploaderWithRandomNameStorage, limits: { fileSize: maxUploadSize } }).array("file");

const responseToClient = (req, res, err) => {
	if (err) {
		if (err.code === "LIMIT_FILE_SIZE") {
			logger.info(`${req.headers["x-real-ip"] || req.connection.remoteAddress} ${req.method} ${req.originalUrl} ${err.code}`);
			return res.json({ statue: "ERROR", message: `File is too big! Upload size limit is ${maxUploadSize}MB` });
		}
	}
	let jsonData = [];
	req.files.forEach((value, index, array) => {
		logger.info(
			`${req.headers["x-real-ip"] || req.connection.remoteAddress} ${req.method} ${req.originalUrl} Saved file: ${value.originalname} to ${value.path} with size ${value.size} bytes`
		);
		jsonData.push({ statue: "OK", originalName: value.originalname, fileURL: `${baseURL}/files/${value.filename}`, fileSize: value.size, mimetype: value.mimetype });
	});
	return res.json(jsonData);
};

router.post("/", (req, res) => {
	if (req.header("Token") == process.env.TOKEN) {
		uploaderWithName(req, res, err => {
			responseToClient(req, res, err);
		});
	} else {
		uploaderWithRandomName(req, res, err => {
			responseToClient(req, res, err);
		});
	}
});

router.use("/files", express.static(uploadFolder));

module.exports = router;
