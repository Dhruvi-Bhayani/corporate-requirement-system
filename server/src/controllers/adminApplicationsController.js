import { Application } from "../models/Application.js";
import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Organization } from "../models/Organization.js";

/* -----------------------------------------
   GET ALL APPLICATIONS
------------------------------------------*/
export const getAllApplications = async (req, res) => {
    try {
        const apps = await Application.findAll({
            include: [
                {
                    model: User,
                    attributes: ["full_name", "email"]
                },
                {
                    model: Job,
                    attributes: ["title"],
                    include: [
                        { model: Organization, attributes: ["name"] }
                    ]
                }
            ],
            order: [["applied_at", "DESC"]], // ✅ FIXED
        });

        res.json(apps);

    } catch (err) {
        console.error("Error in getAllApplications:", err);
        res.status(500).json({ error: err.message });
    }
};


/* -----------------------------------------
   UPDATE APPLICATION STATUS
------------------------------------------*/
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const app = await Application.findByPk(id);
        if (!app) return res.status(404).json({ error: "Application not found" });

        app.status = status;
        await app.save();

        res.json({ message: "Status updated", app });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* -----------------------------------------
   DELETE APPLICATION
------------------------------------------*/
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        await Application.destroy({ where: { id } });

        res.json({ message: "Application deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
