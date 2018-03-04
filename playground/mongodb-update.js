const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

// db.collection("Todos").findOneAndUpdate({
//   _id: new ObjectID("5a99503b106c9afe5e49c2d6")},
//    {
//      $set: {
//        completed: true
//      }
//    }, {
//     returnOriginal: false
//   }).then((result) => {
//       console.log(`Todo \"${result.value.text}\" is completed`);
//     });

db.collection("Blabla").findOneAndUpdate({_id: new ObjectID("5a97f1e67400c41b2ca95189")},
{
  $set: {
    name: "Marina"
    },
  $inc: {
      age: 1
       }
}).then((result) => {
  console.log(`User ${result.value.name} has been updated`);
});
//  db.close();
});
