import express from "express";
import path from "path";
import https from "https";
import initDb from "./lib/conf/initDb";
import {
  addMessageRow,
  addUsesRow,
  deleteMessageById,
  findHash,
  getMessages,
  markHasRead,
  markHasWritten,
  retrieveAllRows,
} from "./lib/dbMethods";
import { hash } from "./lib/hash";
import { usesRow } from "./lib/types";
import mongoose from "mongoose";
import { Server as socketServer } from "socket.io";

// try {
//   mongoose.connect("mongodb://localhost/test");
// } catch (err) {
//   console.error(err);
// }

const app = express();
app.use(express.json());
const expressServer = https.createServer(app);
const io = new socketServer(expressServer);

// const db = initDb();

app.get("/", (req, res) => {
  // TODO (maybe): default page
  res.send("not for you");
});

// routes

app.use(express.static(path.join(__dirname, "/public")));

/*
adminHashAndAdd
@methods: post
@params: 
  adminKey: a permanent hashed passphrase I'll need to make and pass as a var and store
  elsewhere
  value: the name or word I want to hash and add
@returns:
  status: 200 if it added
  hash: the hashed value, so I can add it
*/
app.post("/adminHashAndAdd", (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== adminKey) {
    console.log("[POST/adminHashAndAdd] invalid key, rejecting");
    res.status(404).send(`Invalid request`);
    return;
  } else if (req.query.adminKey === adminKey) {
    const input = req.query.value as string;
    const output = hash(input);
    addUsesRow(db, output);
    res.status(200).json({
      status: "ok",
      hash: output,
    });
  }
});

/*
adminRetrieve
@methods: GET
@params:
  adminKey: same hashed passphrase as above
@returns:
  a json list of all the hashes and their statuses
    - is there a db function to get this?
    a: haha not a good one
*/
app.get("/adminRetrieveHashes", (req, res) => {
  if (!req.query.adminKey || req.query.adminKey !== adminKey) {
    console.log("[GET/adminRetrieveHashes] invalid key, rejecting");
    res.status(404).send(`Invalid request`);
    return;
  } else if (req.query.adminKey === adminKey) {
    retrieveAllRows(db, (rows: usesRow[]) => {
      console.log(
        `[GET/adminRetrieveHashes] valid key, sending retrieved rows`
      );
      res.status(200).json(rows);
    });
  }
});

// app.listen(3000);

// https
//   .createServer(
//     {
//       cert: fs.readFileSync("/etc/letsencrypt/live/imboard.one/fullchain.pem"),
//       key: fs.readFileSync("/etc/letsencrypt/live/imboard.one/privkey.pem"),
//     },
//     app
//   )
//   .listen(443, () => {
//     console.log("server listening on 443");
//   });
