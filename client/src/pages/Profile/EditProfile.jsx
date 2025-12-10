import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

const BASE_URL = "https://corporate-requirement-system-production.up.railway.app";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    headline: "",
    summary: "",
    skills: "",
    resume_url: "",
  });

  /* ✅ LOAD EXISTING PROFILE DATA */
  useEffect(() => {
    const token =
      localStorage.getItem("user_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    axios
      .get(`${BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;

        setForm({
          headline: data.headline || "",
          summary: data.summary || "",
          skills: Array.isArray(data.skills)
            ? data.skills.join(", ")
            : "",
          resume_url: data.resume_url || "",
        });
      })
      .catch((err) => {
        console.error("Profile load error:", err);
        alert("❌ Failed to load profile");
      });
  }, []);

  /* ✅ HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ✅ UPDATE PROFILE */
  const handleUpdate = async () => {
    try {
      const token =
        localStorage.getItem("user_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token");

      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await axios.put(
        `${BASE_URL}/api/profile`,
        {
          headline: form.headline,
          summary: form.summary,
          skills: skillsArray,
          resume_url: form.resume_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>

      <input
        type="text"
        name="headline"
        value={form.headline}
        onChange={handleChange}
        placeholder="Professional Headline"
      />

      <textarea
        name="summary"
        value={form.summary}
        onChange={handleChange}
        placeholder="Profile Summary"
      />

      <input
        type="text"
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="Skills (comma separated)"
      />

      <input
        type="text"
        name="resume_url"
        value={form.resume_url}
        onChange={handleChange}
        placeholder="Resume URL"
      />

      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
}
