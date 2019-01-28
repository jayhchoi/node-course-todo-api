const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

bcrypt
  .genSalt(10)
  .then(salt => bcrypt.hash(password, salt))
  .then(hashed => console.log(hashed));

// const hashed = '$2a$10$P.n.V.sc3Tz1qcf5QmrTqOGq48e/xBc4SeubHkZ5GNYIFIqksDoEK';

// bcrypt.compare(password, hashed, (err, res) => {
//   console.log(res);
// });

// const data = {
//   id: 10,
//   access: 'auth'
// };

// const token = sign(data, '123abc');
// console.log(token);
// console.log(token.toString());

// const decoded = verify(token, '123abc');
// console.log('decoded', decoded);

// const message = 'lkjsadljknwerelkjnr';
// const hash = SHA256(message).toString();

// console.log(message, hash);

// const data = {
//   id: 4
// };

// // We send this to client
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // If the client somehow manipulates the token.data, we would know
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
