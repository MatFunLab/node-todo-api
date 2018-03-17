const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var data = {
  id: 5
};

var token = jwt.sign(data, "123abc");
console.log(token);

var decoded = jwt.verify(token, "123abc");
console.log(decoded);
// function randomize () {
//   var text = "";
//   var alphabet ="abcdefghijklmnoprstuvz0123456789";
//   for(var i = 0; i < 4; i++) {
//     text += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
//   }
//   return text;
// }

// var data = {
//   id: 6
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "secret").toString()
// };
//
//
// var resultHash = SHA256(JSON.stringify(token.data) + "secret").toString();
//
// if(resultHash === token.hash) {
//   console.log("token verified");
// } else {
//   console.log("token not right");
// }
