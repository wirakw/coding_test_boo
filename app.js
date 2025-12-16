'use strict';

const express = require('express');
const { connect } = require('./config/database');
const apiRoutes = require('./routes/api');
const app = express();
const port =  process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// Initialize database connection
connect().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// routes
app.use('/', require('./routes/profile')());

app.use('/api', apiRoutes());

// start server
const server = app.listen(port);
console.log('Express started. Listening on %s', port);
