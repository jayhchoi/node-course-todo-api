const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');
const { authenticate } = require('./middlewares/authenticate');

const app = express();

const PORT = process.env.PORT || 3000;

// Use middlewares
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo
    .save()
    .then(doc => {
      res.send(doc);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then(todos => {
      res.send({ todos }); // Sending object is better than sending array
    })
    .catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
  // Get req params from url
  const { id } = req.params;

  // Validate Mongo ObjectId
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // Query the todo with the id
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      // Send response with the data
      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  // Validate Mongo ObjectId
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  // Remove todo by id
  Todo.findByIdAndDelete(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send(todo);
    })
    .catch(e => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'completed']);

  // Validate Mongo ObjectId
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    // If completed === true, set completedAt to current time
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });
    })
    .catch(e => res.status(400).send());
});

// POST /users
app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(PORT, () => {
  console.log(`Starting on port ${PORT}`);
});

module.exports = { app };
