const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socket = require('socket.io');

const connectDB = require('./db');

const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const gameRoute = require('./routes/games');
const gameRoom = require('./routes/rooms');
const room = require('./controllers/room.socket');

const { PORT = 9999 } = process.env;
const app = express();
const server = http.Server(app);

const io = socket(server, {
  path: '/room/',
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

io.on('connection', (client) => {
  room.connect(client);
  room.answer(client);
});

// let online = 0;
const users = [];
io.on('connection', (client) => {
  const { name } = client.handshake.query;
  users.push(name);
  console.log('User connected');
  console.log(users);
  console.log(name);
  io.emit('new-user-connected', users);
  client.on('disconnect', () => {
    const index = users.indexOf(name);
    if (index < 0) {
      return;
    }
    users.splice(index, 1);
    io.emit('user-disconnected', users);
  });
});

app.use((request, response, next) => {
  console.log(`--->  ${request.method} -- ${request.url}`);
  next();
});

app.use('/users/', usersRoute);

app.use('/auth/', authRoute);

app.use('/games/', gameRoute);

app.use('/rooms/', gameRoom);

app.use(express.static('./client/build'));

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 400,
    message: err.message,
  });
});

const serverStart = async () => {
  try {
    await connectDB();

    await server.listen(PORT, () => {
      console.log(`Server is started on port №${PORT}`);
    });
  } catch (e) {
    console.log('Something went wrong', e);
  }
};

serverStart();
