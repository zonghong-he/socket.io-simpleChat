const express = require('express');
const app = express();
const formidble = require('formidable');
const moment = require('moment/moment');
const fs = require('fs');
const cors = require('cors');
const {
  userJoin,
  userLeave,
  getCurrentUser,
  getRoomUsers,
} = require('./utils/users');

app.use(
  cors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST',
  })
);

app.get('/avatar', (req, res) => {
  //解構返回的陣列
  const [file] = fs.readdirSync('public').filter((file) => {
    return file.startsWith(req.query.id);
  });

  const fileType = file.split('.')[1];
  const avatar = fs.readFileSync(`public/${file}`, 'base64');

  res.end(`data:image/${fileType};base64,${avatar}`);
});

app.post('/upload', (req, res) => {  
  const form = new formidble.IncomingForm();
  
  form.parse(req, (err, fileds, files) => {
    const fileName = fileds.id;
    const fileType = files.image.mimetype.split('/')[1];

    fs.writeFileSync(
      `public/${fileName}.${fileType}`,
      fs.readFileSync(files.image.filepath)
    );

    res.sendStatus(200);
  });
  
});

const sever = app.listen(8080, () => {
  const host = sever.address().address;
  const port = sever.address().port;
});

const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:3001'],
  },
});

io.on('connection', (socket) => {
  const id = socket.handshake.query.id;

  socket.on('join-room', (username, room) => {
    const user = userJoin(id, username, room);
    const message = `${username} join ${user.room}`;

    socket.join(user.room);
    receiveRoomUsers(user.room);
    systemMessage(message, user.room);
  });

  socket.on('disconnect', () => {
    const user = userLeave(id);

    if (user) {
      const message = `${user.username} leave ${user.room}`;
      receiveRoomUsers(user.room);
      systemMessage(message, user.room);
    }
  });

  socket.on('send-message', (sender, room) => {
    if (!room) return;
    sender.time = moment().format('HH:mm');
    io.to(room).emit('receive-message', sender);
  });
});

function receiveRoomUsers(room) {
  io.to(room).emit('room-users', {
    room: room,
    users: getRoomUsers(room),
  });
}
function systemMessage(message, room) {
  const systemSender = {
    username: 'system',
    avatar: null,
    message: message,
    time: moment().format('HH:mm'),
  };
  io.to(room).emit('receive-message', systemSender);
}
