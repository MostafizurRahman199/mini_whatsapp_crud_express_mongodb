const express = require("express");
const path = require("path");
const Chat = require("./models/Chat.js");
const mongoose = require("mongoose");
const methodOverRide = require("method-override");



const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverRide("_method"));

// MongoDB connection (ensure the correct URL)
main().then(()=>{
    console.log("connection successful")
}).catch(err => console.log(err));

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    }).then(() => {
        console.log('MongoDB connected successfully');
    }).catch((err) => {
        console.log('MongoDB connection error:', err);
    });
}


app.get("/chats", async(req, res) => {
    try {
        let chats = await Chat.find();
        console.log("All chats  :", chats);
        // res.send("working")
        res.render("index.ejs", { chats });
    } catch (error) {
        console.log("Error fetching chats:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/chats/new", (req, res)=>{
    res.render("new.ejs");
})

// edit route
app.get("/chats/:id/edit", async(req, res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
})

// update route
app.patch("/chats/:id", async (req, res) => {
    const { id } = req.params;
    const { message: newMessage, from: newFrom, to: newTo } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        { message: newMessage, from: newFrom, to: newTo },
        { overwrite: true, runValidators:true } // Force overwrite
    );

    res.redirect("/chats");
});


// delete route
app.delete('/chats/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Chat.findByIdAndDelete(id); // Delete the chat with the given ID
        res.redirect('/chats'); // Redirect to the chats list after deletion
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.post("/chats", async (req, res)=>{
     const {from, to , message} = req.body;

     let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date(),
        
     })

    await newChat.save().then((res)=>{console.log(`Chat was saved`)}).catch((error)=>{console.log(error)});

     console.log(newChat);
     res.redirect("/chats");
})

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
