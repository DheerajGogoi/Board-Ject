const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const projectRouter = require('./routes/project');
const convRoute = require('./routes/conversations')
const messageRoute = require('./routes/messages')
const notificationsRoute = require('./routes/notification')
const logger = require('./utils/logger');
const helmet = require("helmet");
const morgan = require("morgan");
const jwt = require('jsonwebtoken');
var fs = require('fs')

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const connection = mongoose.connection;
connection.once('open', () => {
  app.listen(port, function (){
    logger.log('info', `Server started, MongoDB connected Successfully`);
  });
});
mongoose.connection.close();

app.get("/", (req,res) => {
  res.json("It's Working");
})

// jwt authentication
app.post('/login', (req, res) => {
  console.log(req.body);
  const user = req.body
  const id = user._id;

  const token = jwt.sign({id}, process.env.JWT_SECRET);
  // const token = jwt.sign({id}, process.env.JWT_SECRET, {
  //   expiresIn: 120 //in seconds
  // });
  console.log({ auth: true, token, user });

  res.json({ auth: true, token, user });
})

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if(!token) {
    res.json({ auth: false, message: 'Please enter a token' })
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        res.json({ auth: false, message: 'Authentication failed' });
      } else {
        req.userId = decoded.id;
        next();
      }
    })
  }
}

app.get('/isUserAuth', verifyToken, (req, res) => {
  res.json({ auth: true, message: 'You are authenticated' });
})

app.get('/activity',(req, res) => {
  fs.readFile(__dirname + '/activity.log', (error, data) => {
    data = data.toString();
    error ? res.json({content: error}) : res.json({content: data});
  });
})

// END POINTS
app.use('/project', projectRouter);
app.use('/api/conversation', convRoute);
app.use('/api/messages', messageRoute);
app.use('/api/notifications', notificationsRoute);