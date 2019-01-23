const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    //   .deleteMany({ text: 'Eat lunch' })
    //   .then(res => {
    //     console.log(res);
    //   });

    // db.collection('Todos')
    //   .findOneAndDelete({ _id: new ObjectID('5c47d9de502234c856c3455b') })
    //   .then(res => {
    //     console.log(res);
    //   });

    // db.close();
  }
);
