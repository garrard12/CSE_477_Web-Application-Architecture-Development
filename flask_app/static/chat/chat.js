src="//code.jquery.com/jquery-1.4.2.min.js"
src="https://cdn.socket.io/3.1.1/socket.io.min.js"
charset="utf-8"

const chatTextBox = document.getElementById("chatBoxId")
const leaveChatRoom = document.getElementById("leaveChatRoom")
/**
 * Makes the chat box for user to see and display the messages
 */
var socket;
$(document).ready(function(){

    socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');
    socket.on('connect', function() {
        console.log('Connection has been made')
        socket.emit('joined', {});
    });
    socket.on('status', function(data) {
        let tag  = document.createElement("p");
        let text = document.createTextNode(data.msg);
        let element = document.getElementById("chat");
        tag.appendChild(text);
        tag.style.cssText = data.style;
        element.appendChild(tag);
        $('#chat').scrollTop($('#chat')[0].scrollHeight);
    });
});

/**
 * When the user hit enter on the keyboard return send the message to the chat box
 */
chatTextBox.addEventListener("keydown", function (input) {
        if (input.key === "Enter") {
                console.log("Enter key pressed")
                var socket;
                socket = io.connect('https://' + document.domain + ':' + location.port + '/chat');
                socket.emit('msgsend', input.target.value);
                input.target.value = "";
        }
    });
/**
 * When the user hits leave button in the chat room prints a message and redriect the user back
 * to home
 */
leaveChatRoom.addEventListener('click', function() {
        socket.emit('leave', {}, function() {
            socket.disconnect();
            window.location.href = "/home";
            // go back to the login page
        });
     });


