import { Profile } from "../models/Profile.js";

/* =========================================
   ✅ GET PROFILE (AUTO-CREATE IF NOT EXISTS)
========================================= */
export const getProfile = async (req, res) => {
  try {
    // ✅ JWT SAFE USER ID
    const userId = req.user.userId || req.user.id;

    let profile = await Profile.findOne({
      where: { user_id: userId },
    });

    // ✅ AUTO CREATE IF NOT EXISTS
    if (!profile) {
      profile = await Profile.create({
        user_id: userId,
        headline: "",
        summary: "",
        skills: [],          // ✅ STORE AS ARRAY (NOT STRING)
        resume_url: "",
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* =========================================
   ✅ UPDATE PROFILE
========================================= */
export const updateProfile = async (req, res) => {
  try {
    // ✅ JWT SAFE USER ID
    const userId = req.user.userId || req.user.id;

    const profile = await Profile.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { headline, summary, skills, resume_url } = req.body;

    profile.headline = headline ?? profile.headline;
    profile.summary = summary ?? profile.summary;
    profile.skills = skills ?? profile.skills;   // ✅ NO stringify
    profile.resume_url = resume_url ?? profile.resume_url;

    await profile.save();

    res.json({
      message: "✅ Profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ error: err.message });
  }
};
