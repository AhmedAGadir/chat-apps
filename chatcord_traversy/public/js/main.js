
const chatForm = document.querySelector('#chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById(('room-name'));
const userList = document.getElementById('users');

// get username and room from URL

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

console.log(username, room);

// message from server
socket.on('message', message => {
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

// join chatroom 
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// message submit 
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // get message text
    const msg = e.target.elements.msg.value;

    // Emitting a message to the server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage({ username, text, time }) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
          <p class="text">
            ${text}
          </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}