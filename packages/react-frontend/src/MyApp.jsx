import React, {useState, useEffect} from 'react';
import Table from "./Table";
import Form from "./Form";



function MyApp() {

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  const [characters, setCharacters] = useState([
    { name: "Charlie", job: "Janitor" },
    { name: "Mac", job: "Bouncer" },
    { name: "Dee", job: "Aspiring actress" }, // fixed typo
    { name: "Dennis", job: "Bartender" },
  ]);

  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  function updateList(person) {
  setCharacters([...characters, person]);
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
