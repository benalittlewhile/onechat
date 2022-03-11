import express from "express";
import path from "path";
import https from "https";
import { Server as socketServer } from "socket.io";
import mongoose, { model, Model } from "mongoose";
import { chatMessageSchema, chatSchema } from "./schemas";
import { IChat, IChatMessage } from "./lib/types";

try {
  const app = express();
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "/public")));
  const expressServer = https.createServer(app);
  const io = new socketServer(expressServer);

  io.on("connection", (socket) => {
    console.log("new connection");
    socket.on("banana", () => {
      console.log("banana");
    });
    socket.on("message", (messageText) => {
      console.log(messageText);
      socket.broadcast.emit("serverMessage", messageText);
    });
  });

  // routes

  /*
GET getMessages/:id
*/
  app.get("/:id/getMessages", (req, res) => {
    if (req.params.id) {
      Chats.find({ id: req.params.id }, (err, doc) => {
        if (!err) {
          res.json(doc);
        }
      });
    }
  });

  app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
  });

  io.on("message", () => {
    console.log(`new message: `);
  });

  mongoose.connect("mongodb://localhost/test");
  const db = mongoose.connection;
  db.useDb("oneChat");

  const Messages: Model<IChatMessage> = db.model("messages", chatMessageSchema);
  const Chats: Model<IChat> = db.model("chats", chatSchema);

  (async function () {
    const newMessage: IChatMessage = await Messages.create({
      chatId: "0f2",
      sentAt: Date.now(),
      sentBy: "Ben",
      message: "Hello Friend",
    });

    console.log(newMessage._id);
    Messages.find({ chatId: "0f3" }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log(res);
        console.log(typeof res);
      }
    });
  })();

  db.useDb("oneChat");
  db.collection("firstChatTest");

  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", () => {
    const server = app.listen(3000);
    io.listen(server);
    console.log("io is listening on 3000");
  });
} catch (err) {
  console.error(err);
}

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
// */
// app.post("/adminHashAndAdd", (req, res) => {
//   if (!req.query.adminKey || req.query.adminKey !== adminKey) {
//     console.log("[POST/adminHashAndAdd] invalid key, rejecting");
//     res.status(404).send(`Invalid request`);
//     return;
//   } else if (req.query.adminKey === adminKey) {
//     const input = req.query.value as string;
//     const output = hash(input);
//     addUsesRow(db, output);
//     res.status(200).json({
//       status: "ok",
//       hash: output,
//     });
//   }
// });

/*
adminRetrieve
@methods: GET
@params:
  adminKey: same hashed passphrase as above
@returns:
  a json list of all the hashes and their statuses
    - is there a db function to get this?
    a: haha not a good one
// */
// app.get("/adminRetrieveHashes", (req, res) => {
//   if (!req.query.adminKey || req.query.adminKey !== adminKey) {
//     console.log("[GET/adminRetrieveHashes] invalid key, rejecting");
//     res.status(404).send(`Invalid request`);
//     return;
//   } else if (req.query.adminKey === adminKey) {
//     retrieveAllRows(db, (rows: usesRow[]) => {
//       console.log(
//         `[GET/adminRetrieveHashes] valid key, sending retrieved rows`
//       );
//       res.status(200).json(rows);
//     });
//   }
// });

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
