const crypto = require('crypto');
const fs = require("fs");
const path = require("path");
const manifest = require("./manifest.json");

function hash(data) {
  return crypto.createHash("sha256").update(data).digest().toString("hex");
}

for (const file in manifest["files"]) {
	const filepath = path.join(__dirname, file);
	const filedata = manifest["files"][file];
	let expectedHash = null;
	if (typeof filedata === 'object') {
    	expectedHash = filedata["hash"].toUpperCase();
    } else {
        expectedHash = filedata.toUpperCase();
    }

    const calculatedHash = hash(fs.readFileSync(filepath));

	if (calculatedHash.toUpperCase() !== expectedHash) {
		console.log(file, calculatedHash);
	}
}