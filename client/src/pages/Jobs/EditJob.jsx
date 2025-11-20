// src/pages/Jobs/EditJob.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ToastMessage from "../../components/ToastMessage"; // ✅ ADD THIS
import "./EditJob.css";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [toast, setToast] = useState({ show: false, message: "" }); // ✅ TOAST STATE

    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        employment_type: "",
        salary_min: "",
        salary_max: ""
    });

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then((res) => setForm(res.data))
            .catch((err) => console.error("Failed to load job", err));
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/jobs/${id}`, form);

            // ✅ SHOW TOAST INSTEAD OF ALERT
            setToast({ show: true, message: "Job updated successfully!" });

            // Small delay to show toast
            setTimeout(() => {
                navigate(`/jobs/${id}`);
            }, 1200);

        } catch (err) {
            console.error(err);
            setToast({ show: true, message: "Update failed!" });
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white py-3">
                            <h4 className="mb-0 text-center">Edit Job Details</h4>
                        </div>

                        <div className="card-body p-4">
                            <form onSubmit={handleUpdate}>

                                {/* Job Title */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.title}
                                        onChange={(e) =>
                                            setForm({ ...form, title: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                {/* Location */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={form.location}
                                        onChange={(e) =>
                                            setForm({ ...form, location: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Employment Type */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Employment Type
                                    </label>
                                    <select
                                        className="form-select"
                                        value={form.employment_type}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                employment_type: e.target.value,
                                            })
                                        }
                                    >
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Internship</option>
                                        <option>Contract</option>
                                    </select>
                                </div>

                                {/* Salary Range */}
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Salary Min (₹)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.salary_min}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    salary_min: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Salary Max (₹)
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={form.salary_max}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    salary_max: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        className="form-control"
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({ ...form, description: e.target.value })
                                        }
                                    />
                                </div>

                                {/* Save Button */}
                                <button type="submit" className="btn btn-primary w-100 py-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* ✅ TOAST MESSAGE */}
            <ToastMessage
                show={toast.show}
                message={toast.message}
                onClose={() => setToast({ show: false, message: "" })}
            />
        </div>
    );
}
