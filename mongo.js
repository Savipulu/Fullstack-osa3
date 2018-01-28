const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose.connect(url);
mongoose.Promise = global.Promise;

const Person = mongoose.model("Person", {
  name: String,
  number: String
});

const person = new Person({
  name: "",
  number: ""
});

const args = process.argv;

if (args.length === 4) {
  console.log(
    "Lisätään henkilö " + args[2] + " numero " + args[3] + " luetteloon"
  );
  person.name = args[2];
  person.number = args[3];
  person.save().then(() => {
    console.log("saved person to phonebook");
    mongoose.connection.close();
  });
} else if (args.length === 2) {
  console.log("puhelinluettelo: ");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  mongoose.connection.close();
}
