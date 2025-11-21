// src/pages/Jobs/EditJob.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ToastMessage from "../../components/ToastMessage";
import "./EditJob.css";

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [toast, setToast] = useState({ show: false, message: "" });

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

            setToast({ show: true, message: "Job updated successfully!" });

            setTimeout(() => {
                navigate(`/jobs/${id}`);
            }, 1200);

        } catch (err) {
            console.error(err);
            setToast({ show: true, message: "Update failed!" });
        }
    };

    return (
        <div className="editjob-wrapper">

            <div className="editjob-card">

                {/* ⭐ Floating round back button */}
                <button className="editjob-back-btn" onClick={() => navigate(-1)}>
                    <i className="uil uil-arrow-left"></i>
                </button>

                <div className="editjob-title">Edit Job Details</div>

                <form onSubmit={handleUpdate}>

                    {/* Job Title */}
                    <label className="editjob-label">Job Title</label>
                    <div className="input-icon-box">
                        <i className="uil uil-edit"></i>
                        <input
                            type="text"
                            className="editjob-input"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    {/* Location */}
                    <label className="editjob-label">Location</label>
                    <div className="input-icon-box">
                        <i className="uil uil-map-marker"></i>
                        <input
                            type="text"
                            className="editjob-input"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                        />
                    </div>

                    {/* Employment Type */}
                    <label className="editjob-label">Employment Type</label>
                    <div className="input-icon-box">
                        <i className="uil uil-briefcase"></i>
                        <select
                            className="editjob-input"
                            value={form.employment_type}
                            onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                        >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Internship</option>
                            <option>Contract</option>
                        </select>
                    </div>

                    {/* Salary Row */}
                    <div className="row-two">
                        <div>
                            <label className="editjob-label">Salary Min (₹)</label>
                            <div className="input-icon-box">
                                <i className="uil uil-rupee-sign"></i>
                                <input
                                    type="number"
                                    className="editjob-input"
                                    value={form.salary_min}
                                    onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="editjob-label">Salary Max (₹)</label>
                            <div className="input-icon-box">
                                <i className="uil uil-rupee-sign"></i>
                                <input
                                    type="number"
                                    className="editjob-input"
                                    value={form.salary_max}
                                    onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <label className="editjob-label">Description</label>
                    <textarea
                        rows="3"
                        className="editjob-input description-box"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    {/* Save Button */}
                    <button className="editjob-btn">Save Changes</button>

                </form>

            </div>

            <ToastMessage
                show={toast.show}
                message={toast.message}
                onClose={() => setToast({ show: false, message: "" })}
            />

        </div>
    );
}
