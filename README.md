# CLI File Upload Server

## Install

```bash
git clone https://github.com/NY0510/cli-file-upload.git
cd cli-file-upload
npm install
```

<br>

## Usage

Create `.env` file in the root of the project.

```dosini
UPLOAD_FOLDER='./file/' # Folder to store uploaded files
MAX_UPLOAD_SIZE=10 # Max file size in MB
TOKEN='supersupersecretny64token' # Token to authenticate requests
BASE_URL='http://localhost' # Base URL of the server
PORT=3000 # Port to run the server on
```

<br>

## Upload files using curl

### Windows (PowerShell)

```bash
curl /X POST URL_OF_SERVER /F 'file=@FILE_NAME'
```

### Linux

```bash
curl -X POST URL_OF_SERVER -F 'file=@FILE_NAME'
```

If you want to **upload multiple files,** you can use `-F file=@FILE_NAME'` or `/F file=@FILE_NAME'` several times.

<br>

### Upload files using secret token

If you upload a **secret token** with it **included in the header**, you can save it while preserving the **original file name**, not the random file name.

`-H 'Token: SUPER_SECRET_TOKEN'` , `/H 'Token: SUPER_SECRET_TOKEN'` Add this after the command.

Example:

```bash
curl -X POST URL_OF_SERVER -F 'file=@FILE_NAME' -H 'Token: SUPER_SECRET_TOKEN'
```

<br>

## Server response

### Success

```json
[
	{
		"statue": "OK",
		"originalName": "testfile1.gif",
		"fileURL": "http://localhost:3000/files/87e092cbc8f57ca2501578a201e338e567e8.gif",
		"fileSize": 965311,
		"mimetype": "image/gif"
	},
	{
		"statue": "OK",
		"originalName": "testfile2.ico",
		"fileURL": "http://localhost:3000/files/076df2b8ed466d4c179aedb7724e19721280.ico",
		"fileSize": 370070,
		"mimetype": "application/octet-stream"
	}
]
```

### Success with secret token

```json
[
	{
		"statue": "OK",
		"originalName": "testfile1.gif",
		"fileURL": "http://localhost:3000/files/1643769689678_testfile1.gif",
		"fileSize": 965311,
		"mimetype": "image/gif"
	},
	{
		"statue": "OK",
		"originalName": "testfile2.ico",
		"fileURL": "http://localhost:3000/files/1643769689689_testfile2.ico",
		"fileSize": 370070,
		"mimetype": "application/octet-stream"
	}
]
```

### File size error

```json
{
	"statue": "ERROR",
	"message": "File is too big! Upload size limit is 1MB"
}
```
