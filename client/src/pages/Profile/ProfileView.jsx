import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfileView.css";

export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("user_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("auth_token");

    axios
      .get("http://localhost:3000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);   // ✅ THIS WAS MISSING
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        alert("❌ Failed to load profile");
      });
  }, []); // ✅ MUST BE EMPTY DEP ARRAY

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
