import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

export default function OrganizationsPage() {
    const [orgs, setOrgs] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [search, setSearch] = useState("");
    const [approvalFilter, setApprovalFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const fetchOrganizations = async () => {
        try {
            const token = localStorage.getItem("admin_token");

            const res = await axios.get(
                "http://localhost:3000/api/admin/organizations",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOrgs(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.error("Organization fetch error:", err);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    /* -------------------- SEARCH + FILTER --------------------- */
    useEffect(() => {
        let data = [...orgs];

        if (search.trim() !== "") {
            data = data.filter((org) =>
                `${org.name} ${org.Users?.[0]?.full_name} ${org.Users?.[0]?.email}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        if (approvalFilter !== "") {
            const isApproved = approvalFilter === "approved";
            data = data.filter((org) => org.is_approved === isApproved);
        }

        setFiltered(data);
        setCurrentPage(1);
    }, [search, approvalFilter, orgs]);

    /* -------------------- PAGINATION --------------------- */
    const indexOfLast = currentPage * perPage;
    const indexOfFirst = indexOfLast - perPage;
    const currentData = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / perPage);

    const approveOrg = async (id) => {
        try {
            const token = localStorage.getItem("admin_token");

            await axios.put(
                `http://localhost:3000/api/admin/organizations/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchOrganizations();
        } catch (err) {
            console.error("Approve organization error:", err);
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
                    Organizations
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
                        placeholder="Search organizations..."
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
                        value={approvalFilter}
                        onChange={(e) => setApprovalFilter(e.target.value)}
                        style={selectBox}
                    >
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
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
                                <th style={th}>Organization</th>
                                <th style={th}>Admin Name</th>
                                <th style={th}>Email</th>
                                <th style={th}>Status</th>
                                <th style={th}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentData.map((org, index) => (
                                <tr
                                    key={org.id}
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
                                    <td style={td}>{org.name}</td>
                                    <td style={td}>{org.Users?.[0]?.full_name || "Not Assigned"}</td>
                                    <td style={td}>{org.Users?.[0]?.email || "N/A"}</td>

                                    <td style={td}>
                                        <span
                                            style={{
                                                padding: "6px 13px",
                                                borderRadius: "8px",
                                                background: org.is_approved
                                                    ? "#00e676"
                                                    : "#ff1744",
                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "13px",
                                            }}
                                        >
                                            {org.is_approved ? "Approved" : "Pending"}
                                        </span>
                                    </td>

                                    <td style={td}>
                                        {!org.is_approved && (
                                            <button
                                                onClick={() => approveOrg(org.id)}
                                                style={{
                                                    ...actionBtn,
                                                    background: "#00e676",
                                                }}
                                            >
                                                Approve
                                            </button>
                                        )}
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
                                        No organizations found
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
