const socket = io("https://setu-zo64.onrender.com");

let currentUser = "";

function joinChat(){

    let name =
    document.getElementById("username").value.trim();

    if(name===""){
        return;
    }

    currentUser = name;

    document.getElementById("login-page").style.display="none";
    document.getElementById("chat-page").style.display="block";

    document.getElementById("user-title").innerText =
    "Setu - " + currentUser;
}

function sendMessage(){

    let input =
    document.getElementById("message");

    let text =
    input.value.trim();

    if(text===""){
        return;
    }

    socket.emit("chat message", {
        user: currentUser,
        text: text
    });

    input.value="";
}

socket.on("chat message", (data)=>{

    let msg =
    document.createElement("div");

    msg.className = "message";

    msg.innerHTML =
    "<b>" + data.user + "</b><br>" +
    data.text;

    document.getElementById("chat-box")
    .appendChild(msg);

});
