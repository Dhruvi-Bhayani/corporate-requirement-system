import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

export default function ApplicationsPage() {
    const [apps, setApps] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const fetchApps = async () => {
        try {
            const token = localStorage.getItem("admin_token");

            const res = await axios.get("http://localhost:3000/api/admin/applications", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setApps(res.data);
            setFilteredApps(res.data);
        } catch (err) {
            console.error("Error loading applications:", err);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    /* ---------------------------- SEARCH + FILTER ----------------------------- */
    useEffect(() => {
        let data = [...apps];

        if (search.trim() !== "") {
            data = data.filter((app) =>
                `${app.User?.full_name} ${app.User?.email} ${app.Job?.title} ${app.Job?.Organization?.name}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (statusFilter !== "") {
            data = data.filter((app) => app.status === statusFilter);
        }

        setFilteredApps(data);
        setCurrentPage(1);
    }, [search, statusFilter, apps]);

    /* ---------------------------- PAGINATION ----------------------------- */
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = filteredApps.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredApps.length / perPage);

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("admin_token");

            await axios.put(
                `http://localhost:3000/api/admin/applications/${id}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchApps();
        } catch (err) {
            console.error("Status update failed:", err);
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            const token = localStorage.getItem("admin_token");

            await axios.delete(
                `http://localhost:3000/api/admin/applications/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchApps();
        } catch (err) {
            console.error("Delete failed:", err);
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
                        textShadow: "0 0 12px rgba(255,255,255,0.4)",
                    }}
                >
                    Applications
                </h1>

                {/* SEARCH + FILTER BAR */}
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
                        placeholder="Search applications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            padding: "12px",
                            width: "300px",
                            borderRadius: "10px",
                            border: "1px solid #ddd",
                            background: "white",
                            fontSize: "15px",
                        }}
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={selectBox}
                    >
                        <option value="">All Status</option>
                        <option value="applied">Applied</option>
                        <option value="screening">Screening</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* TABLE */}
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
                                <th style={th}>Applicant</th>
                                <th style={th}>Email</th>
                                <th style={th}>Job</th>
                                <th style={th}>Organization</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((app) => (
                                <tr
                                    key={app.id}
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
                                    <td style={td}>{app.User?.full_name}</td>
                                    <td style={td}>{app.User?.email}</td>
                                    <td style={td}>{app.Job?.title}</td>
                                    <td style={td}>{app.Job?.Organization?.name}</td>

                                    <td style={td}>
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateStatus(app.id, e.target.value)}
                                            style={{
                                                padding: "8px",
                                                borderRadius: "8px",
                                                background: "white",
                                                border: "1px solid #ddd",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <option value="applied">Applied</option>
                                            <option value="screening">Screening</option>
                                            <option value="shortlisted">Shortlisted</option>
                                            <option value="interview_scheduled">Interview Scheduled</option>
                                            <option value="selected">Selected</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </td>

                                    <td style={td}>
                                        <button
                                            onClick={() => deleteApplication(app.id)}
                                            style={{
                                                ...actionBtn,
                                                background: "#ff1744",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {currentData.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            padding: "20px",
                                            textAlign: "center",
                                            color: "#eee",
                                        }}
                                    >
                                        No applications found
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

/* ---------------------- STYLES ---------------------- */

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
};

const actionBtn = {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
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
    background: "rgba(255,255,255,0.2)",
    color: "white",
};
