var {mongoose} = require("./../server/db/mongoose");
var {ObjectID} = require("mongodb");
var {Todo} = require("./../server/models/todo");

// Todo.remove({}).then((result) => {
//   console.log(result);
// }).catch((e) => {
//     console.log(e);
// });

// finds the first result and removes it (it returns the document)
// Todo.findOneAndRemove({_id: "5aa6e9f98b88268eb8cac234"}).then((todo) => {
//   console.log(`${todo.text} is deleted`);
// }).catch((e) => {
//
// });

// finds the result by id and removes it (it returns the document)
Todo.findByIdAndRemove("5aa6e9f98b88268eb8cac234").then((todo) => {
  console.log(`${todo.text} is deleted`);
}).catch((e) => {
  console.log(e);
});
