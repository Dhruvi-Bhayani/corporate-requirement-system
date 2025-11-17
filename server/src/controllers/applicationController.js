// src/controllers/applicationController.js
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { sendMail } from "../utils/email.js";

// ---------------- APPLY JOB ----------------
export const applyJob = async (req, res) => {
  try {
    const { jobId, cover_letter, resume_url } = req.body;
    const userId = req.user.id;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const existing = await Application.findOne({
      where: { job_id: jobId, applicant_id: userId }
    });
    if (existing) return res.status(400).json({ error: "Already applied to this job" });

    const application = await Application.create({
      job_id: jobId,
      applicant_id: userId,
      cover_letter: cover_letter || null,
      resume_url: resume_url || null,
    });

    const applicant = await User.findByPk(userId);

    await sendMail(
      applicant.email,
      "Your Job Application Was Submitted",
      `
        <h2>Hello ${applicant.full_name},</h2>
        <p>You have successfully applied for the job:</p>
        <h3>${job.title}</h3>
        <p>We will notify you when the recruiter updates your application status.</p>
        <br/>
        <p>Regards,<br/>Job Portal Team</p>
      `
    );

    res.status(201).json({
      message: "Application submitted and email sent",
      application
    });

  } catch (err) {
    console.error("Apply Job Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ---------------- GET USER APPLICATIONS ----------------
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.findAll({
      where: { applicant_id: userId },
      include: [Job],
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- UPDATE APPLICATION STATUS ----------------
export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;
    await application.save();

    res.json({ message: "Application status updated", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- GET JOB APPLICATIONS (HR/Manager) ----------------
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (req.user.organization_id !== job.organization_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [{ model: User, attributes: ["full_name", "email"] }]
    });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
