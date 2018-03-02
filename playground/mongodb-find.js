const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // db.collection("Todos").find({completed: false}).toArray().then((docs) => {
  //   console.log("Todos");
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log("Unable to fetch documents", err);
  // });

  db.collection("Blabla").find({age: 21}).toArray().then((docs) => {
    for(var i = 0; i<docs.length; i++) {
      console.log(docs[i].name + "\n");
    }
  }, (err) => {
    console.log("Unable to count documents", err);
  });
//  db.close();
});
