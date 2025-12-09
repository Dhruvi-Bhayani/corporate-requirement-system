// // src/controllers/applicationController.js
// import { Application } from "../models/Application.js";
// import { Job } from "../models/Job.js";
// import { User } from "../models/User.js";
// import { sendMail } from "../utils/email.js";

// // ---------------- APPLY JOB ----------------
// // export const applyJob = async (req, res) => {
// //   try {
// //     const { jobId, cover_letter, resume_url } = req.body;
// //     const userId = req.user.id;

// //     const job = await Job.findByPk(jobId);
// //     if (!job) return res.status(404).json({ error: "Job not found" });

// //     const existing = await Application.findOne({
// //       where: { job_id: jobId, applicant_id: userId }
// //     });
// //     if (existing) return res.status(400).json({ error: "Already applied to this job" });

// //     const application = await Application.create({
// //       job_id: jobId,
// //       applicant_id: userId,
// //       cover_letter: cover_letter || null,
// //       resume_url: resume_url || null,
// //     });

// //     const applicant = await User.findByPk(userId);

// //     await sendMail(
// //       applicant.email,
// //       "Your Job Application Was Submitted",
// //       `
// //         <h2>Hello ${applicant.full_name},</h2>
// //         <p>You have successfully applied for the job:</p>
// //         <h3>${job.title}</h3>
// //         <p>We will notify you when the recruiter updates your application status.</p>
// //         <br/>
// //         <p>Regards,<br/>Job Portal Team</p>
// //       `
// //     );

// //     res.status(201).json({
// //       message: "Application submitted and email sent",
// //       application
// //     });

// //   } catch (err) {
// //     console.error("Apply Job Error:", err);
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // ---------------- APPLY JOB ----------------
// export const applyJob = async (req, res) => {
//   try {
//     // ❌ Block organization users (Recruiters)
//     if (req.user.role === "ORGANIZATION") {
//       return res.status(403).json({ error: "Organizations cannot apply for jobs" });
//     }

//     const { jobId, cover_letter, resume_url } = req.body;
//     const userId = req.user.id;

//     const job = await Job.findByPk(jobId);
//     if (!job) return res.status(404).json({ error: "Job not found" });

//     const existing = await Application.findOne({
//       where: { job_id: jobId, applicant_id: userId }
//     });
//     if (existing) return res.status(400).json({ error: "Already applied to this job" });

//     const application = await Application.create({
//       job_id: jobId,
//       applicant_id: userId,
//       cover_letter: cover_letter || null,
//       resume_url: resume_url || null,
//     });

//     const applicant = await User.findByPk(userId);

//     await sendMail(
//       applicant.email,
//       "Your Job Application Was Submitted",
//       `
//         <h2>Hello ${applicant.full_name},</h2>
//         <p>You have successfully applied for the job:</p>
//         <h3>${job.title}</h3>
//         <p>We will notify you when the recruiter updates your application status.</p>
//         <br/>
//         <p>Regards,<br/>Career Grid Team</p>
//       `
//     );

//     res.status(201).json({
//       message: "Application submitted and email sent",
//       application
//     });

//   } catch (err) {
//     console.error("Apply Job Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// // ---------------- GET USER APPLICATIONS ----------------
// export const getUserApplications = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const applications = await Application.findAll({
//       where: { applicant_id: userId },
//       include: [Job],
//     });

//     res.json(applications);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------- UPDATE APPLICATION STATUS ----------------
// export const updateApplicationStatus = async (req, res) => {
//   try {
//     const { appId } = req.params;
//     const { status } = req.body;

//     const application = await Application.findByPk(appId);
//     if (!application) return res.status(404).json({ error: "Application not found" });

//     application.status = status;
//     await application.save();

//     res.json({ message: "Application status updated", application });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---------------- GET JOB APPLICATIONS (HR/Manager) ----------------
// export const getJobApplications = async (req, res) => {
//   try {
//     const { jobId } = req.params;

//     const job = await Job.findByPk(jobId);
//     if (!job) return res.status(404).json({ error: "Job not found" });

//     if (req.user.organization_id !== job.organization_id) {
//       return res.status(403).json({ error: "Not authorized" });
//     }

//     const applications = await Application.findAll({
//       where: { job_id: jobId },
//       include: [{ model: User, attributes: ["full_name", "email"] }]
//     });

//     res.json(applications);

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// src/controllers/applicationController.js
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { User } from "../models/User.js";
import { sendMail } from "../utils/email.js";

// -----------------------------------------------------
// APPLY JOB  (ONLY JOB SEEKERS)
// -----------------------------------------------------
export const applyJob = async (req, res) => {
  try {
    // ❌ Prevent organization users from applying
    if (["org_admin", "hr", "manager", "recruiter"].includes(req.user.role)) {
      return res.status(403).json({ error: "Organizations cannot apply for jobs" });
    }

    const { jobId, cover_letter, resume_url } = req.body;
    const userId = req.user.id;

    // ⭐ If resume_url is missing → STOP
    if (!resume_url || resume_url.trim() === "") {
      return res.status(400).json({ error: "Resume URL missing. Upload resume first." });
    }

    // ⭐ If resume_url is a relative path → convert to full URL
    let finalResumeUrl = resume_url;
    if (!resume_url.startsWith("http")) {
      finalResumeUrl = `${req.protocol}://${req.get("host")}${resume_url}`;
    }

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ❌ Prevent applying if job is closed
    if (job.status !== "open") {
      return res.status(400).json({ error: "This job is closed" });
    }

    // ❌ Prevent duplicate applications
    const existing = await Application.findOne({
      where: { job_id: jobId, applicant_id: userId }
    });
    if (existing) {
      return res.status(400).json({ error: "Already applied for this job" });
    }

    // ⭐ Create Application (saving correct resume URL)
    const application = await Application.create({
      job_id: jobId,
      applicant_id: userId,
      cover_letter: cover_letter || null,
      resume_url: finalResumeUrl,         // ⭐ FIXED
      status: "applied",
      status_history: [
        {
          from: null,
          to: "applied",
          by: userId,
          by_name: req.user.full_name,
          at: new Date(),
          note: "Application submitted"
        }
      ]
    });

    const applicant = await User.findByPk(userId);

    // EMAIL
    await sendMail(
      applicant.email,
      "Your Job Application Was Submitted",
      `
      <h2>Hello ${applicant.full_name},</h2>
      <p>You have successfully applied for:</p>
      <h3>${job.title}</h3>
      <p>We will notify you when the recruiter updates your application status.</p>
      <br>
      <p>Regards,<br/>Career Grid Team</p>
      `
    );

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });

  } catch (err) {
    console.error("Apply Job Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// -----------------------------------------------------
// GET LOGGED-IN USER APPLICATIONS (JOB SEEKER)
// -----------------------------------------------------
export const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.findAll({
      where: { applicant_id: userId },
      include: [Job],
      order: [["applied_at", "DESC"]]
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// -----------------------------------------------------
// UPDATE APPLICATION STATUS (ORG ONLY)
// -----------------------------------------------------
export const updateApplicationStatus = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status, note, interview_at } = req.body;
    const user = req.user;

    const application = await Application.findByPk(appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    const job = await Job.findByPk(application.job_id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ❌ Only same organization can update
    if (user.organization_id !== job.organization_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // previous status (for history)
    const prev = application.status;

    // update status
    application.status = status;

    // interview date if scheduled
    if (status === "interview_scheduled" && interview_at) {
      application.interview_at = interview_at;
    }

    // store recruiter notes
    if (note) {
      application.recruiter_notes = (application.recruiter_notes || "") +
        `\n[${new Date().toISOString()}] ${user.full_name}: ${note}`;
    }

    // update status history
    const history = application.status_history || [];
    history.push({
      from: prev,
      to: status,
      by: user.id,
      by_name: user.full_name,
      at: new Date(),
      note: note || null
    });
    application.status_history = history;

    await application.save();

    // send mail to applicant
    const applicant = await User.findByPk(application.applicant_id);

    await sendMail(
      applicant.email,
      `Your Application Status Updated`,
      `
      <h2>Hello ${applicant.full_name},</h2>
      <p>Your application for <strong>${job.title}</strong> is now:</p>
      <h3>${status.toUpperCase()}</h3>
      ${interview_at ? `<p>Interview Scheduled on: ${new Date(interview_at).toLocaleString()}</p>` : ""}
      ${note ? `<p>Note: ${note}</p>` : ""}
      <br><p>Regards,<br/>Career Grid Team</p>
      `
    );

    res.json({ message: "Status updated", application });

  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ error: err.message });
  }
};



// -----------------------------------------------------
// GET ALL APPLICATIONS FOR A JOB (ORG ONLY)
// -----------------------------------------------------
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findByPk(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ❌ Only same organization can view
    if (req.user.organization_id !== job.organization_id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [
        { model: User, attributes: ["id", "full_name", "email"] }
      ],
      order: [["applied_at", "DESC"]]
    });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
