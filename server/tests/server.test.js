// TESTING, I WILL COME BACK LATER
// FOR NOW, MAKING THE APP UP AN RUNNING IS MORE IMPORTANT

const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

beforeEach(done => {
  Todo.deleteMany({}).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', done => {
    // async needs done()
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({ text }) // autumatically converted to json
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });
});
