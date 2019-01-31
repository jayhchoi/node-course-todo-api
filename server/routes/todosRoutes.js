const { Todo } = require('../models/todo');
const { authenticate } = require('../middlewares/authenticate');

module.exports = app => {
  app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
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

  app.get('/todos', authenticate, (req, res) => {
    Todo.find({ _creator: req.user._id })
      .then(todos => {
        res.send({ todos }); // Sending object is better than sending array
      })
      .catch(e => res.status(400).send(e));
  });

  app.get('/todos/:id', authenticate, (req, res) => {
    // Get req params from url
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    // Query the todo with the id
    Todo.findOne({ _id: id, _creator: req.user._id })
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }

        // Send response with the data
        res.send({ todo });
      })
      .catch(e => res.status(400).send());
  });

  app.delete('/todos/:id', authenticate, (req, res) => {
    const { id } = req.params;

    // Validate Mongo ObjectId
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    // Remove todo by id
    Todo.findOneAndRemove({ _id: id, _creator: req.user._id })
      .then(todo => {
        if (!todo) {
          return res.status(404).send();
        }

        res.send(todo);
      })
      .catch(e => res.status(400).send());
  });

  app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
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
};
