import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem("admin_token");

            const res = await axios.get("http://localhost:3000/api/admin/jobs", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setJobs(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.error("Jobs fetch error:", err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    /* -----------------------------------
          SEARCH + FILTER LOGIC
    ----------------------------------- */
    useEffect(() => {
        let data = [...jobs];

        if (search.trim() !== "") {
            data = data.filter((j) =>
                `${j.title} ${j.Organization?.name} ${j.status}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (statusFilter !== "") {
            data = data.filter((j) => j.status === statusFilter);
        }

        setFiltered(data);
        setCurrentPage(1);
    }, [search, statusFilter, jobs]);

    /* -----------------------------------
               PAGINATION
    ----------------------------------- */
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const toggleStatus = async (id) => {
        try {
            const token = localStorage.getItem("admin_token");

            await axios.put(
                `http://localhost:3000/api/admin/jobs/${id}/toggle-status`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchJobs();
        } catch (err) {
            console.error("Toggle job error:", err);
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
                    Jobs Management
                </h1>

                {/* SEARCH + FILTER CARD */}
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
                        placeholder="Search jobs..."
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
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={selectBox}
                    >
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="draft">Draft</option>
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
                                <th style={th}>#</th>
                                <th style={th}>Title</th>
                                <th style={th}>Organization</th>
                                <th style={th}>Status</th>
                                <th style={th}>Posted Date</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((job, index) => (
                                <tr
                                    key={job.id}
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
                                    <td style={td}>{indexOfFirst + index + 1}</td>
                                    <td style={td}>{job.title}</td>
                                    <td style={td}>{job.Organization?.name || "—"}</td>

                                    <td style={td}>
                                        <span
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                background:
                                                    job.status === "open"
                                                        ? "#00e676"
                                                        : job.status === "closed"
                                                            ? "#ff1744"
                                                            : "#ff9100",
                                                color: "white",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {job.status.toUpperCase()}
                                        </span>
                                    </td>

                                    <td style={td}>
                                        {job.posted_at
                                            ? new Date(job.posted_at).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td style={td}>
                                        <button
                                            onClick={() => toggleStatus(job.id)}
                                            style={{
                                                ...actionBtn,
                                                background:
                                                    job.status === "open"
                                                        ? "#ff1744"
                                                        : "#00e676",
                                            }}
                                        >
                                            {job.status === "open"
                                                ? "Close Job"
                                                : "Reopen Job"}
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
                                        No jobs found
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
    background: "rgba(255,255,255,0.2)",
    color: "white",
};
