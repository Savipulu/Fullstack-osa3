const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const personsLength = 5000;
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.static("build"));

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);
app.use(bodyParser.json());

let persons = [
  {
    name: "Eka",
    number: "040-1231234",
    id: 1
  },
  {
    name: "Toka",
    number: "040-1231234",
    id: 2
  },
  {
    name: "Kolmas",
    number: "040-1231234",
    id: 3
  }
];

app.get("/", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(Person.format));
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      "<div>Puhelinluettelossa " +
        persons.length +
        " henkilön tiedot</div>" +
        "<div>" +
        new Date() +
        "</div>"
    );
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(Person.format));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person));
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      res.status(400).end({ error: "bad id" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      console.log(error);
      res.status(400).send({ error: "bad id" });
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  } else if (body.number === undefined) {
    return res.status(400).json({ error: "number missing" });
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: "name already in persons" });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  Person.find({ name: body.name }).then(result => {
    if (result) {
      console.log("Cannot add two people with the same name");
      return;
    }
  });

  person.save().then(savedPerson => {
    res.json(Person.format(savedPerson));
  });
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson));
    })
    .catch(error => {
      console.log(error);
      res.status(400).send({ error: "bad id" });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
