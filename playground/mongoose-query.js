var {mongoose} = require("./../server/db/mongoose");
var {ObjectID} = require("mongodb");
var {Todo} = require("./../server/models/todo");

var id = "5aa1ad2d4d0296c42170634e22";

//ObjectID.isValid(id) - mongoDB method on ObjectID object for id property validation


//return array of objects
// Todo.find({
//   completed: false
// }).then((todos) => {
//   console.log(todos[0].text + "\n" + todos[1].text);
// });
//
// //return object
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log(todo.text);
// });

Todo.findById(id).then((todo) => {
  if(!todo) {
  return  console.log(`user by id of ${id} not found`);
  }
  console.log("This is by findById method: " + todo.text);
}, () => {
  console.log("misspelled id, try again");
});

// or instead of second callback we can attach .catch(() => {
//   console.log("misspelled id, try again");
// });
