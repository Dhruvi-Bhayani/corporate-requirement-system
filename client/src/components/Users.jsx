import { useEffect, useState } from "react";
import api from "../services/api"; // 👈 import the axios instance

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users") // this calls http://localhost:3000/api/users
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  return (
    <div>
      <h2>Users List</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
