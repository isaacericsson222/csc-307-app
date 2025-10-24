// backend.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userService from "./user-services.js";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Base route
app.get("/", (_req, res) => res.send("API OK — try GET /users"));

// ---- USERS ROUTES ----

// GET /users?name=&job=
app.get("/users", async (req, res) => {
  try {
    const { name, job } = req.query;
    const users = await userService.getUsers(name, job);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users/:id
app.get("/users/:id", async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

// POST /users
app.post("/users", async (req, res) => {
  try {
    const created = await userService.addUser(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Validation error" });
  }
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await userService.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

// ---- CONNECT TO DB ----

mongoose.connection.once("open", () => {
  console.log("✅ Mongo connected");
  app.listen(PORT, () =>
    console.log(`✅ API listening on http://localhost:${PORT}`)
  );
});

mongoose.connection.on("error", (err) => {
  console.error("Mongo connection error:", err);
});

/*
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUserById = (id) => {
  const index = users["users_list"].findIndex(
    (user) => user["id"] === id
  );
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  } else {
    return false;
  }
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 3; i++) {
    id += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    id += Math.floor(Math.random() * 10);
  }
  userToAdd.id = id;

  //new user had id last, doesn't look as nice :)
  const newUser = {
    id: id,
    name: userToAdd.name,
    job: userToAdd.job,
  };
  //this resets the order

  addUser(newUser);
  res.status(201).send(newUser);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name != undefined && job != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  const success = deleteUserById(id);

  if (success) {
    res.status(204).send(); 
  } else {
    res.status(404).send("Resource not found.");
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});
*/