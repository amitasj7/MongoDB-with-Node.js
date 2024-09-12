const express = require("express");
const app = express();

const path = require("path");
var methodOverride = require("method-override");
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());

// request ki body se data access krne ke liye --
app.use(express.urlencoded({ extended: true }));

const Chat = require("./models/chat");

const port = 8080;

// connect database with node.js

const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whattsapp");
}

main()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// server start
app.listen(port, () => {
  console.log("server run Successfully");
});

app.get("/", (req, res) => {
  res.send("Now you are in Chat World");
});

// show all chat cards
app.get("/chat", async (req, res) => {
  let chats = await Chat.find();
  //   console.log(chats);

  res.render("allChat.ejs", { chats });
});

// add new user chat
// step-1: /chat/new --> return a form

app.get("/chat/new", (req, res) => {
  res.render("addUser.ejs");
});

// step-2: /chat --> post request and add new user chat

app.post("/chat", (req, res) => {
  const { message, from, to } = req.body;

  //   console.log("message : ", message, from, to);

  const newChat = new Chat({
    message: message,
    from: from,
    to: to,
    created_at: new Date(),
  });

  newChat
    .save()
    .then(() => {
      console.log("new chat successfully add");
    })
    .catch((e) => {
      console.log("New Chat add problem: ", e);
    });

  res.redirect("/chat");
});

// Search a chat

// Step-1: form render hoga
app.get("/chat/search", (req, res) => {
  res.render("chatSearch.ejs");
});

// Step-2: Card render hoga
app.get("/chat/user", (req, res) => {
  const { from, to } = req.query;
  //   console.log("from is ",from,to)

  Chat.find({ $or: [{ from: from }, { to: to }] })
    .then((searchChat) => {
      //   console.log("chats is", searchChat);

      if (searchChat.length == 0) {
        res.send("NO Chat availabe");
      } else {
        res.render("allChat.ejs", { chats: searchChat });
      }
    })
    .catch((e) => {
      console.log("serach chat problem : ", e);
    });
});

// DELETE chat

app.delete("/chat/:_id", (req, res) => {
  const { _id } = req.params;

  Chat.findByIdAndDelete(_id)
    .then((chat) => {
      console.log("chat delete succesfully: ", chat);

      res.redirect("/chat");
    })
    .catch((e) => {
      console.log("chat delete problem: ", e);
    });
});

// edit chat of user
// step-1: get a form /user/:id

app.get("/chat/:_id", (req, res) => {
  const { _id } = req.params;

  Chat.findById(_id)
    .then((editChat) => {
      // console.log(editChat);

      res.render("editChat.ejs", { editChat });
    })
    .catch((e) => {
      console.log("edit user not find in database problem: ", e);
    });
});

// step-2: put /user/:id
app.put("/chat/:_id", (req, res) => {
  const { _id } = req.params;
  console.log("_id : ",_id); 

  const { message, from, to } = req.body;

  const updateValue = {
    message: message,
    from: from,
    to: to,
    created_at: new Date(),
  };

  Chat.findByIdAndUpdate(
    _id,
    {
      $set: updateValue,
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .then((editChat) => {
      // console.log(editChat);

      console.log("update successfully")

      res.redirect("/chat");
    })
    .catch((e) => {
      console.log("Database edit chat problem: ", e);
    });
});
