const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    db.collection('Todos')
      .findOneAndUpdate(
        {
          _id: new ObjectID('5c47d53b502234c856c34407')
        },
        {
          // UPDATE OPERATORS
          $set: {
            test: 'sdfsdfsd',
            completed: true
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(res => {
        console.log(res);
      });

    // db.close();
  }
);
