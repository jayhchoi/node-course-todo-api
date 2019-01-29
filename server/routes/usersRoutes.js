const { User } = require('../models/user');
const { authenticate } = require('../middlewares/authenticate');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

module.exports = app => {
  app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);

    user
      .save()
      .then(() => user.generateAuthToken())
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

  app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
      .then(user =>
        user.generateAuthToken().then(token => {
          res.header('x-auth', token).send(user);
        })
      )
      .catch(e => res.status(400).send(e));
  });

  app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send();
      },
      () => {
        res.status(400).send();
      }
    );
  });
};
