const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const authRouter = require('./controllers/auth');
const usersRouter = require('./controllers/users');
const propertiesRouter = require('./controllers/properties');
const hostEventsRouter = require('./controllers/hostEvents');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/properties', propertiesRouter);
app.use('/hostEvents', hostEventsRouter);

app.listen(3000, () => {
  console.log('The express app is ready!');
});
