import express from "express";
import path from "node:path";
import databasesync, { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./testApp.db");
db.close();

const __dirname = import.meta.dirname;
const app = express();
const port = 4572;

app.use(express.static(path.join(__dirname, "../frontEnd")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/createPost", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontEnd/index.html"));
});

app.get("/readPosts", async (req, res) => {
  let result;
  try {
    result = await getPostsFromDatabase();
  } catch (e) {
    console.error("ERROR SQL");
    console.error(e);
    result = e;
  }
  console.log("result is:", result);
  res.json(result);
});

app.post("/createPost", async (req, res) => {
  const postBodyParam = req.body.postBody;
  console.log(postBodyParam);
  try {
    insertPostToDatabase(postBodyParam);
  } catch (e) {
    console.error("ERROR SQL");
    console.error(e);
  }
  res.json({ message: true, inserted: postBodyParam });
});

async function insertPostToDatabase(postBodyParam) {
  try {
    db.open();
    const query = "INSERT INTO POSTS (P_BODY) VALUES (?);";
    const prep = await db.prepare(query);
    prep.get(postBodyParam);
    db.close();
  } catch (e) {
    console.error("ERROR SQL");
    console.error(e);
  }
}

async function getPostsFromDatabase() {
  let rows;
  try {
    db.open();
    const query = "SELECT * FROM POSTS ORDER BY CREATED_AT DESC LIMIT 10;";
    const prep = db.prepare(query);
    rows = await prep.all();
    db.close();
  } catch (e) {
    console.error("ERROR SQL");
    console.error(e);
  }
  return rows;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
