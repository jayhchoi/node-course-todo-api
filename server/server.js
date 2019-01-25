const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { ObjectID } = require('mongodb');

const app = express();

const PORT = process.env.PORT || 3000;

// Use middlewares
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });

  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
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

app.listen(PORT, () => {
  console.log(`Starting on port ${PORT}`);
});

module.exports = { app };
