//@ts-check

import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { v7 as uuidv7 } from 'uuid';
import express from "express";
import bcrypt from "bcryptjs";

const db = new DatabaseSync("./dataBase/socialMediaWebApp.db");
db.close();

const __dirname = import.meta.dirname;
const app = express();
const port = 6969;
const pathToFrontEnd = "../frontEnd";

app.use(express.static(path.join(__dirname, pathToFrontEnd)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/redirectToLogin", function serveLogin(req, res) {
	res.redirect(path.join(__dirname, "../frontEnd/login.html"));
});

app.get("/", function serveIndex(req, res) {
	res.sendFile(path.join(__dirname, "../frontEnd/index.html"));
});

app.post("/registerFormData", async function sendRegisterData(req, res) {
	const userData = {
		"userName": req.body.userName, 
		"userEmail": req.body.userEmail, 
		"userPassword": req.body.userPassword
	};
	console.log(userData["userEmail"]);
	const duplicateEmail = await checkIfEmailAlreadyExistsInDatabase(userData["userEmail"]);
	console.log(duplicateEmail);
	const emailAlreadyExists = duplicateEmail["emailAlreadyExists"];
	const emailObjStatus = duplicateEmail["status"]
	if (emailObjStatus === "ErrorGettingData") {
		res.json({ status: "Error" });
	}
	if (emailObjStatus === "NoErrors" && emailAlreadyExists) {
		res.json({ status: "Duplicate" })
	}
	if (emailObjStatus === "NoErrors" && !emailAlreadyExists) {
		const insertionSuccessful = await insertCredsToDatabase(userData);
		console.log("MESSAGE SUCC", insertionSuccessful["status"]);
		if (insertionSuccessful["status"] === "DBInsertionSuccess") {
			res.json({ status: "GG!" })
		}
	}
});

function generateUserIdentifier() {
	const uniqueIdentifier = uuidv7();
	console.log(`UUID: ${uniqueIdentifier}`);
	return uniqueIdentifier;
}

async function getHashedUserPassword(userPlainPassword) {
	const salt = await bcrypt.genSalt(5);
	const userHashedPassword = await bcrypt.hash(userPlainPassword, salt);
	console.log(`HASHEDPASS: ${userHashedPassword}`);
	return userHashedPassword;
}

async function checkIfEmailAlreadyExistsInDatabase(userEmail) {
	const emailAlreadyExistsObj = { emailAlreadyExists: true, status: "NoErrors" }
	const receivedData = await getEmailFromDatabase(userEmail);
	if (receivedData["status"] === "DBFoundEmails") {
		const getResultProperty = receivedData["resultFromQueryExecution"];
		const userCount = getResultProperty["COUNT(*)"];
		console.log("RES DATA", userCount);
		if (userCount === 0) {
			emailAlreadyExistsObj["emailAlreadyExists"] = false;
			console.log("eftasaaa!");
		}
		console.log("aaaaaaaaaaaaaaaaaaaaa!!!!");
		return emailAlreadyExistsObj;
	}
	emailAlreadyExistsObj["status"] = "ErrorGettingData";
	return emailAlreadyExistsObj;
}


async function getEmailFromDatabase(userEmail) {
	const statusObj = { status: "DBCannotFindEmails" };
	const findEmailQuery = "SELECT COUNT(*) FROM USERS WHERE U_EMAIL = ?;";
	const databaseOpened = await openDataBase();
	if (databaseOpened["status"] === "DBOpened") {
		try {
			console.log("eftasa");
			const preparedStatement = db.prepare(findEmailQuery);
			const res = preparedStatement.get(userEmail.trim());
			const databaseClosed = await closeDataBase();
			if (databaseClosed["status"] === "DBClosed") {
				statusObj["status"] = "DBFoundEmails";
				statusObj["resultFromQueryExecution"] = res;
				return statusObj;
			}
		}
		catch (er) {
			return statusObj;
		}
	}
	return statusObj;
}

function openDataBase() {
	const statusObj = { status: "DBOpeningError" };
	try {
		db.open()
		statusObj["status"] = "DBOpened";
		return statusObj;
	}
	catch (er) {
		return statusObj;
	}
}

function closeDataBase() {
	const statusObj = { status: "DBClosingError" };
	try {
		db.close();
		statusObj["status"] = "DBClosed";
		return statusObj;
	}
	catch (er) {
		return statusObj;
	}
}

async function insertCredsToDatabase(userData) {
	const statusObj = { status: "DBInsertionError" };
	const insertionQuery = `INSERT INTO USERS (U_ID, U_NAME, U_EMAIL, U_PASSWORD, U_BIO, U_PROFILE_IMAGE_LINK, U_ROLE) VALUES (?, ?, ?, ?, ?, ?, ?);`;
	const databaseOpened = openDataBase();
	if (databaseOpened["status"] === "DBOpened") {
		try {
			const dataToInsertObj = {
				uid: await generateUserIdentifier(), 
				uname: userData["userName"], 
				uemail: userData["userEmail"],
				upassword: await getHashedUserPassword(userData["userPassword"]),
				ubio: null,
				upfplink: null,
				urole: "USER",
			}
			console.log("ETREKSAN OI SYNARTHSEIS!");
			console.log(dataToInsertObj["uid"]);
			console.log(dataToInsertObj["upassword"]);
			console.log(dataToInsertObj["uemail"]);
			const preparedStatement = db.prepare(insertionQuery);
			preparedStatement.run(
				dataToInsertObj["uid"], 
				dataToInsertObj["uname"],
				dataToInsertObj["uemail"],
				dataToInsertObj["upassword"],
				dataToInsertObj["ubio"],
				dataToInsertObj["upfplink"],
				dataToInsertObj["urole"]);
			console.log("SXEDON SXEDON!!!");
			const databaseClosed = closeDataBase();
			if (databaseClosed["status"] === "DBClosed") {
				statusObj["status"] = "DBInsertionSuccess";
				console.log("Ola Good me eisagwgh!");
				return statusObj;
			}
		}
		catch (err) {
			return statusObj;
		}
	}
	return statusObj;
}

app.listen(port, function runApp() {
	console.log(`Server: RUNNING!`);
});