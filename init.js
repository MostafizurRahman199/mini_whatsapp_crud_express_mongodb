const Chat = require("./models/Chat");
const mongoose = require("mongoose");

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



let allChats = [
    {
        from:"Shifat",
        to:"Maria",
        message:"My Babe",
        created_at: new Date(),
    },
    {
        from:"Asif",
        to:"Ali",
        message:"Where are you?",
        created_at: new Date(),
    },
    {
        from:"Mahabub",
        to:"Tamim",
        message:"We love to play badminton",
        created_at: new Date(),
    },
    {
        from:"Tanjil",
        to:"Rakib",
        message:"Every thing has it's limit ",
        created_at: new Date(),
    },
    {
        from:"Monju",
        to:"Khalid",
        message:"Gaja ase mama?",
        created_at: new Date(),
    },
    {
        from:"Rakib",
        to:"Sujit",
        message:"New collection ase mama?",
        created_at: new Date(),
    },
];


Chat.insertMany(allChats);