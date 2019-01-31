require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
require('./db/mongoose');

const app = express();

// Use middlewares
app.use(bodyParser.json());

// Route handlers
require('./routes/todosRoutes')(app);
require('./routes/usersRoutes')(app);

app.listen(process.env.PORT, () => {
  console.log(`Starting on port ${process.env.PORT}`);
});

module.exports = { app };
