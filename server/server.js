require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');

const app = express();

// Use middlewares
app.use(bodyParser.json());

// Route handlers
require('./routes/todosRoutes')(app);
require('./routes/usersRoutes')(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Starting on port ${PORT}`);
});

module.exports = { app };
