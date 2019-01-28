const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { ObjectID } = require('mongodb');

const app = express();

const PORT = process.env.PORT || 3000;

// Use middlewares
app.use(bodyParser.json());

// Route handlers
require('./routes/todosRoutes')(app);
require('./routes/usersRoutes')(app);

app.listen(PORT, () => {
  console.log(`Starting on port ${PORT}`);
});

module.exports = { app };
