const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server running port " + PORT);
});
