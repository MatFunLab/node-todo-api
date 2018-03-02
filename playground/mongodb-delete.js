const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

//deleteMany
// db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
//   console.log(result);
// });

//deleteOne
// db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result) => {
//   console.log(result.result);
// });

//findOneAndDelete
// db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
//   console.log(result);
// });

// db.collection("Blabla").deleteMany({age: 21}).then((result) => {
//   console.log(result.result);
// });

db.collection("Blabla").findOneAndDelete({_id: new ObjectID("5a9957b0106c9afe5e49c6a5")})
.then((result) => {
  console.log(result.value.name);
});

//  db.close();
});
