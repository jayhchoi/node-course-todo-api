const { ObjectID } = require('mongodb');
require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5c4974d9011dbc35b0d61829';

User.findById(id).then(
  user => {
    console.log(user);
    console.log(JSON.stringify(user, undefined, 2));
  },
  e => {
    console.log(e);
  }
);

// const id = '5c49a18558c94957b8a1a127';

// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then(todos => {
//   console.log('Todos', todos);
// });

// Todo.findOne({
//   _id: id
// })
//   .then(todo => {
//     console.log('Todo', todo);

//     if (!todo) {
//       console.log('Id not found');
//     }
//   })
//   .catch(e => console.log(e));
