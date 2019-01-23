const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    //   .find({ _id: new ObjectID('5c47d53b502234c856c34407') })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log(JSON.stringify(docs, undefined, 2));
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

    // db.collection('Todos')
    //   .find({})
    //   .count()
    //   .then(
    //     count => {
    //       console.log(`Todos count: ${count}`);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );

    db.collection('Users')
      .find({ name: 'Soohee Shin' })
      .toArray()
      .then(
        docs => {
          console.log(JSON.stringify(docs, undefined, 2));
        },
        err => {
          console.log(err);
        }
      );

    // db.close();
  }
);
