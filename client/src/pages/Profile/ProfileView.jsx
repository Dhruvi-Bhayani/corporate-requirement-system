import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileView.css";

const BASE_URL = "https://corporate-requirement-system-production.up.railway.app";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

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
        setProfile(res.data);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        alert("❌ Failed to load profile");
      });
  }, []); // ✅ correct empty dependency array

  if (!profile) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div className="profile-view-container">
      <h2>My Profile</h2>

      <p><b>Headline:</b> {profile.headline || "-"}</p>
      <p><b>Summary:</b> {profile.summary || "-"}</p>

      <p>
        <b>Resume:</b>{" "}
        {profile.resume_url ? (
          <a href={profile.resume_url} target="_blank" rel="noreferrer">
            View Resume
          </a>
        ) : (
          "-"
        )}
      </p>

      <p>
        <b>Skills:</b>{" "}
        {Array.isArray(profile.skills) && profile.skills.length > 0
          ? profile.skills.join(", ")
          : "-"}
      </p>

      <button onClick={() => navigate("/profile/edit")}>
        Edit Profile
      </button>
    </div>
  );
}
