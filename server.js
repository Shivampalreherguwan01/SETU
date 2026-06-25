const express = require("express");
const http = require("http");
const fs = require("fs");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static(__dirname));

app.post("/signup",(req,res)=>{

const { name,mobile } = req.body;

    let users = JSON.parse(
        fs.readFileSync("users.json","utf8")
    );

let userExists = users.find(
    user => user.mobile === mobile
);

    if(userExists){

        return res.json({
message:"Mobile Number Already Registered"
        });

    }

users.push({
    name,
    mobile
});

    fs.writeFileSync(
        "users.json",
        JSON.stringify(users,null,2)
    );

    res.json({
        message:"User Saved"
    });

});

app.post("/login",(req,res)=>{

const { mobile } = req.body;

    let users = JSON.parse(
        fs.readFileSync("users.json","utf8")
    );

let user = users.find(
    u => u.mobile === mobile
);

    if(user){

        res.json({
            success:true,
            message:"Login Success"
        });

    }else{

        res.json({
            success:false,
message:"Mobile Number Not Found"
        });

    }

});

app.get("/users",(req,res)=>{

    let users = JSON.parse(
        fs.readFileSync("users.json","utf8")
    );

    res.json(users);

});

app.post("/save-message",(req,res)=>{

    const {
        from,
        to,
        text,
        time
    } = req.body;

    let messages = JSON.parse(
        fs.readFileSync("messages.json","utf8")
    );

messages.push({
    from,
    to,
    text,
    time
});

io.emit("newMessage",{
from,
to,
text,
time
});

    fs.writeFileSync(
        "messages.json",
        JSON.stringify(messages,null,2)
    );

    res.json({
        message:"Saved"
    });

});

app.get("/messages",(req,res)=>{

    let messages = JSON.parse(
        fs.readFileSync("messages.json","utf8")
    );

    res.json(messages);

});

app.get("/contacts",(req,res)=>{

const owner = req.query.owner;

let contacts = JSON.parse(
fs.readFileSync("contacts.json","utf8")
);

let myContacts = contacts.filter(
c => c.owner === owner
);

res.json(myContacts);

});

app.get("/recent-chats",(req,res)=>{

const owner = req.query.owner;

let messages = JSON.parse(
fs.readFileSync("messages.json","utf8")
);

let contacts = JSON.parse(
fs.readFileSync("contacts.json","utf8")
);

let chats = [];

messages.forEach(msg=>{

if(
msg.from === owner ||
msg.to === owner
){

let otherUser =
msg.from === owner
? msg.to
: msg.from;

let contact =
contacts.find(
c =>
c.owner === owner &&
c.mobile === otherUser
);

chats.push({

mobile: otherUser,

name: contact
? contact.name
: otherUser

});

}

});

let uniqueChats = [];

chats.forEach(chat=>{

if(
!uniqueChats.find(
c => c.mobile === chat.mobile
)
){

uniqueChats.push(chat);

}

});

res.json(uniqueChats);

});

app.post("/save-contact",(req,res)=>{

const { owner,name,mobile } = req.body;

let contacts = JSON.parse(
fs.readFileSync("contacts.json","utf8")
);

contacts.push({
owner,
name,
mobile
});

fs.writeFileSync(
"contacts.json",
JSON.stringify(contacts,null,2)
);

res.json({
message:"Contact Saved"
});

});

io.on("connection",(socket)=>{

    console.log("User Connected");

});

server.listen(3000,()=>{

    console.log("Setu Server Running");

});
