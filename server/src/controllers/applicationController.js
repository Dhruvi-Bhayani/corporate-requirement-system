// src/controllers/applicationController.js
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

export const applyJob = async (req, res) => {
  try {
    const { jobId, cover_letter, resume_url } = req.body;
    const userId = req.user.id; // from JWT

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Check if already applied
    const existing = await Application.findOne({ 
      where: { job_id: jobId, applicant_id: userId } 
    });
    if (existing) return res.status(400).json({ error: "Already applied to this job" });

    // Create new application
    const application = await Application.create({
      job_id: jobId,
      applicant_id: userId,
      cover_letter: cover_letter || null,
      resume_url: resume_url || null,
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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

// HR/Manager: view all applications for a job
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Optional: Only allow HR/Manager of same org
    if (req.user.orgId !== job.organization_id) {
      return res.status(403).json({ error: "Not authorized to view applications for this job" });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: ["User"], // include applicant info
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};