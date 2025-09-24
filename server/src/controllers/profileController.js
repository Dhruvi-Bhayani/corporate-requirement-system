import { Profile } from "../models/Profile.js";

export const createProfile = async (req, res) => {
  try {
    const { headline, summary, skills, resume_url } = req.body;

    const profile = await Profile.create({
      user_id: req.user.id, // from authMiddleware
      headline,
      summary,
      skills: JSON.stringify(skills), // store array as JSON
      resume_url,
    });

    res.json({ message: "Profile created successfully", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const { headline, summary, skills, resume_url } = req.body;
    profile.headline = headline ?? profile.headline;
    profile.summary = summary ?? profile.summary;
    profile.skills = skills ? JSON.stringify(skills) : profile.skills;
    profile.resume_url = resume_url ?? profile.resume_url;

    await profile.save();
    res.json({ message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
