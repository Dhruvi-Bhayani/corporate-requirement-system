import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("admin_token");

            const res = await axios.get("http://localhost:3000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.log("User fetch error:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let data = [...users];

        if (search.trim() !== "") {
            data = data.filter((u) =>
                `${u.full_name} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (roleFilter !== "") {
            data = data.filter((u) => u.role === roleFilter);
        }

        if (statusFilter !== "") {
            const isActive = statusFilter === "active";
            data = data.filter((u) => u.is_active === isActive);
        }

        setFiltered(data);
        setCurrentPage(1);
    }, [search, roleFilter, statusFilter, users]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filtered.length / usersPerPage);

    const toggleUser = async (id) => {
        try {
            const token = localStorage.getItem("admin_token");

            await axios.put(
                `http://localhost:3000/api/admin/users/${id}/toggle`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchUsers();
        } catch (err) {
            console.log("Toggle user error:", err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            const token = localStorage.getItem("admin_token");

            await axios.delete(`http://localhost:3000/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchUsers();
        } catch (err) {
            console.log("Delete user error:", err);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <AdminSidebar />

            <div style={{ marginLeft: "260px", padding: "30px", width: "100%" }}>
                <h1
                    style={{
                        fontSize: "34px",
                        fontWeight: "800",
                        color: "white",
                        marginBottom: "25px",
                        textShadow: "0 0 12px rgba(255,255,255,0.4)",
                    }}
                >
                    Users Management
                </h1>

                {/* SEARCH BAR CARD */}
                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        margin: "20px 0",
                        padding: "20px",
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "14px",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            width: "280px",
                            background: "white",
                            fontSize: "15px",
                        }}
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        style={selectBox}
                    >
                        <option value="">All Roles</option>
                        <option value="job_seeker">Job Seeker</option>
                        <option value="org_admin">Organization Admin</option>
                        <option value="hr">HR</option>
                        <option value="manager">Manager</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={selectBox}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                    </select>
                </div>

                {/* TABLE WRAPPER */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "14px",
                        padding: "20px",
                        boxShadow: "0 6px 25px rgba(0,0,0,0.25)",
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            color: "white",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "linear-gradient(90deg,#6a00f4,#8a2be2)",
                                    color: "white",
                                }}
                            >
                                <th style={th}>#</th>
                                <th style={th}>Name</th>
                                <th style={th}>Email</th>
                                <th style={th}>Role</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentUsers.map((u, index) => (
                                <tr
                                    key={u.id}
                                    style={{
                                        textAlign: "center",
                                        transition: "0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "rgba(255,255,255,0.08)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td style={td}>{indexOfFirstUser + index + 1}</td>
                                    <td style={td}>{u.full_name}</td>
                                    <td style={td}>{u.email}</td>
                                    <td style={td}>{u.role}</td>

                                    <td style={td}>
                                        <span
                                            style={{
                                                padding: "6px 13px",
                                                borderRadius: "8px",
                                                background: u.is_active
                                                    ? "#00e676"
                                                    : "#ff1744",
                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "13px",
                                            }}
                                        >
                                            {u.is_active ? "Active" : "Blocked"}
                                        </span>
                                    </td>

                                    <td style={td}>
                                        <button
                                            onClick={() => toggleUser(u.id)}
                                            style={{
                                                ...actionBtn,
                                                background: u.is_active
                                                    ? "#ff1744"
                                                    : "#00e676",
                                            }}
                                        >
                                            {u.is_active ? "Block" : "Unblock"}
                                        </button>

                                        <button
                                            onClick={() => deleteUser(u.id)}
                                            style={{
                                                ...actionBtn,
                                                background: "#ff3d00",
                                                marginLeft: "8px",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {currentUsers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{ padding: "20px", color: "#eee", textAlign: "center" }}
                                    >
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{
                            ...paginationBtn,
                            opacity: currentPage === 1 ? 0.4 : 1,
                        }}
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            style={{
                                ...paginationBtn,
                                background:
                                    currentPage === i + 1
                                        ? "#6a00f4"
                                        : "rgba(255,255,255,0.2)",
                                color: currentPage === i + 1 ? "white" : "#eee",
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        style={{
                            ...paginationBtn,
                            opacity: currentPage === totalPages ? 0.4 : 1,
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const selectBox = {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    background: "white",
    fontSize: "15px",
    cursor: "pointer",
};

const th = {
    padding: "14px",
    fontSize: "15px",
    fontWeight: "bold",
};

const td = {
    padding: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
};

const actionBtn = {
    padding: "8px 14px",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "0.2s",
};

const paginationBtn = {
    padding: "10px 16px",
    margin: "0 5px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    color: "white",
    background: "rgba(255,255,255,0.2)",
};
