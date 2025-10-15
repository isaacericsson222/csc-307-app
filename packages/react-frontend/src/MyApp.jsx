import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function MyApp() {
  const [characters, setCharacters] = useState([]); // start empty

  function deleteUser(id) {
    return fetch(`${API_BASE}/users/${id}`, { method: "DELETE" }).then(async (res) => {
      if (res.status === 204) return;
      if (res.status === 404) throw new Error("User not found");
      const msg = await res.text().catch(() => "");
      throw new Error(`Delete failed (${res.status}) ${msg}`);
    });
  }

  function postUser(person) {
    const sanitized = {
      name: person.name?.trim() ?? "",
      job: person.job?.trim() ?? "",
    };
    return fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized),
    }).then(async (res) => {
      if (res.status === 201) return res.json();
      const msg = await res.text().catch(() => "");
      throw new Error(`Create failed (status ${res.status}) ${msg}`);
    });
  }

  function fetchUsers() {
    return fetch(`${API_BASE}/users`)
      .then((res) => res.json()); // backend returns an ARRAY, not { users_list: ... }
  }

  useEffect(() => {
    fetchUsers()
      .then((list) => setCharacters(list))
      .catch((error) => console.log(error));
  }, []);

  function removeOneCharacter(index) {
    const user = characters[index];
    if (!user || !user._id) {
      console.warn("No user or user._id at index", index);
      return;
    }
    deleteUser(user._id)
      .then(() => setCharacters((prev) => prev.filter((_, i) => i !== index)))
      .catch((error) => console.log(error));
  }

  function updateList(person) {
    postUser(person)
      .then((createdUser) => setCharacters((prev) => [...prev, createdUser]))
      .catch((error) => console.log(error));
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
