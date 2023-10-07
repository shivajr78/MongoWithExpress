const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//to connect css file to index.ejs file
app.use(express.static(path.join(__dirname, "public")));
//parsing
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main().then(() => {
    console.log("Connection Successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/", (req, res) => {
    res.send("Hello World");
})

//Index Route : Show all chats 
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});



//New Route : to form render
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
})

//Create Route : insert data to db
app.post("/chats", (req, res) => {
    let { from, message, to } = req.body;
    let newChat = new Chat({
        from: from,
        message: message,
        to: to,
        created_at: new Date()
    });
    newChat.save().then(() => {
        console.log("Chat was saved!")
    }).catch(err => console.log(err));

    res.redirect("/chats");
})

//Edit Route : to form render
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
})

//Update Route : 
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { message : newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { message: newMsg },{runValidators:true, new : true});
    res.redirect("/chats");
})

//Destroy Route : 
app.delete("/chats/:id", async (req,res)=>{
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat)
    res.redirect("/chats");
})

app.listen(8080, () => {
    console.log("Server is listening on port 8080...")
});