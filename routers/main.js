const express = require("express");
const router = express.Router();

require("dotenv").config();
const uploadFolder = process.env.UPLOAD_FOLDER;
const maxUploadSize = process.env.MAX_UPLOAD_SIZE * 1000 * 1000;

const multer = require("multer");
const crypto = require("crypto");
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
			fileExtension = file.originalname.split(".")[1]; // get file extension from original file name
		cb(null, customFileName + "." + fileExtension);
	},
});
const uploaderWithName = multer({ storage: uploaderWithNameStorage, limits: { fileSize: maxUploadSize } }).array("file");
const uploaderWithRandomName = multer({ storage: uploaderWithRandomNameStorage, limits: { fileSize: maxUploadSize } }).array("file");

router.get("/", (req, res) => {
	res.send("Hello World!");
});

router.post("/", (req, res) => {
	if (req.header("Token") == process.env.TOKEN) {
		uploaderWithName(req, res, err => {
			if (err) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.send("File is too big!");
				}
			}
			console.log(req.files);
			return res.send("ok");
		});
	} else {
		uploaderWithRandomName(req, res, err => {
			if (err) {
				if (err.code === "LIMIT_FILE_SIZE") {
					return res.send("File is too big!");
				}
			}
			console.log(req.files);
			let jsonData = [];
			req.files.forEach(file => {
				jsonData.push({ fileURL: "http://localhost:3000/files/" + file.filename });
			});
			console.log(jsonData);
			return res.json(jsonData);
		});
	}
});

router.use("/files", express.static(uploadFolder));

// router.get((req, res) => {
// 	res.status(404).send("not found");
// });

module.exports = router;
