import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, token } = useAuth(); // logged-in user
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users", {
          headers: { Authorization: `Bearer ${token}` }, // pass JWT
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {user?.full_name} ({user?.role})
      </h1>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Full Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td className="border px-4 py-2">{u.id}</td>
                <td className="border px-4 py-2">{u.full_name}</td>
                <td className="border px-4 py-2">{u.email}</td>
                <td className="border px-4 py-2">{u.role || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan="4">
                No users found
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
};

export default Dashboard;
