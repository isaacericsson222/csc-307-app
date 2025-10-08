import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";



function MyApp() {

  function deleteUser(id) {
    return fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (res.status === 204) return;
      if (res.status === 404) throw new Error("User not found");
      const msg = await res.text().catch(() => "");
      throw new Error(`Delete failed (${res.status}) ${msg}`);
    });
  }


  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then(async (res) => {
      if (res.status === 201) {
        return res.json();
      }
      const msg = await res.text().catch(() => "");
      throw new Error(`Create failed (status ${res.status}) ${msg}`);
    });

    return promise;
  }

  function fetchUsers() {
    return fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((json) => json["users_list"]);
  }

  useEffect(() => {
    fetchUsers()
      .then((list) => setCharacters(list))
      .catch((error) => console.log(error));
  }, []);

  const [characters, setCharacters] = useState([
    { name: "Charlie", job: "Janitor" },
    { name: "Mac", job: "Bouncer" },
    { name: "Dee", job: "Aspiring actress" }, 
    { name: "Dennis", job: "Bartender" },
  ]);

  function removeOneCharacter(index) {
    const user = characters[index];
    if (!user || !user.id) {
      console.warn("No user or user.id at index", index);
      return;
    }

    deleteUser(user.id)
      .then(() => {
        setCharacters((prev) => prev.filter((_, i) => i !== index));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) { 
postUser(person)
      .then((createdUser) => {
        setCharacters((prev) => [...prev, createdUser]);
      })
      .catch((error) => console.log(error));
}


  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
);
}


export default MyApp;
