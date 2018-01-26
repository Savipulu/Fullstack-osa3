const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const personsLength = 5000;
const cors = require("cors");

app.use(cors());

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
  res.send("Hello World!");
});

app.get("/info", (req, res) => {
  res.send(
    "<div>Puhelinluettelossa " +
      persons.length +
      " henkilön tiedot</div>" +
      "<div>" +
      new Date() +
      "</div>"
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(personsLength));
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: "name missing" });
  } else if (body.number === undefined) {
    return res.status(400).json({ error: "number missing" });
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: "name already in persons" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running port " + PORT);
});
