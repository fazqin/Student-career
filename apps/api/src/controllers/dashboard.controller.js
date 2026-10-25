const pool = require("../config/db");

/**
 * Controller to fetch aggregated dashboard data for students and admins.
 * Returns KPI counts, upcoming interviews, recent applications, and application growth.
 */
const getDashboardData = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        // Query applications for the current user (or all if admin)
        const appsQuery = `
            SELECT
                a.id,
                a.user_id,
                a.position_id,
                a.status,
                a.priority,
                a.applied_date,
                a.deadline AS application_deadline,
                a.notes,
                a.created_at,
                a.updated_at,
                p.title AS position_title,
                p.deadline AS position_deadline,
                c.name AS company_name,
                c.industry AS company_industry
            FROM applications a
            JOIN positions p ON p.id = a.position_id
            JOIN companies c ON c.id = p.company_id
            WHERE ($1 = 'admin' OR a.user_id = $2)
            ORDER BY a.updated_at DESC;
        `;

        const appsResult = await pool.query(appsQuery, [role || "student", userId || null]);
        const applications = appsResult.rows;

        // KPI Counts
        const counts = {
            total: applications.length,
            Wishlist: 0,
            Applied: 0,
            Assessment: 0,
            Interview: 0,
            Offer: 0,
            Rejected: 0,
            Withdrawn: 0
        };

        for (const app of applications) {
            if (counts[app.status] !== undefined) {
                counts[app.status]++;
            } else {
                counts[app.status] = 1;
            }
        }

        // Upcoming interviews: any application whose status is 'Interview'
        const upcomingInterviews = applications
            .filter((a) => a.status === "Interview")
            .map((a) => ({
                id: `interview_app_${a.id}`,
                application_id: a.id,
                company: a.company_name,
                position: a.position_title,
                interview_date: a.application_deadline || a.position_deadline || a.updated_at || new Date().toISOString(),
                date: a.application_deadline || a.position_deadline || a.updated_at || new Date().toISOString(),
                title: `${a.position_title} Interview`,
                contact: a.company_name,
                location: "Online (Google Meet)",
                type: "Online (Google Meet)",
                status: "Scheduled"
            }));

        // Recent applications list
        const recentApplications = applications.slice(0, 6).map((a) => ({
            id: String(a.id),
            userId: a.user_id,
            positionId: String(a.position_id),
            status: a.status,
            stage: a.status,
            priority: a.priority,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
            appliedDate: a.applied_date,
            deadline: a.application_deadline ?? a.position_deadline,
            notes: a.notes,
            position: {
                id: String(a.position_id),
                title: a.position_title,
                deadline: a.position_deadline
            },
            company: {
                name: a.company_name,
                industry: a.company_industry
            }
        }));

        // Weekly growth series over 8 weeks
        const weeks = Array.from({ length: 8 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - 7 * (7 - i));
            return d;
        });

        const growth = weeks.map((d, idx) => {
            const count = applications.filter(
                (a) => new Date(a.created_at || a.applied_date).getTime() <= d.getTime()
            ).length;
            const interviewCount = applications.filter(
                (a) => a.status === "Interview" && new Date(a.updated_at || a.created_at).getTime() <= d.getTime()
            ).length;
            const offerCount = applications.filter(
                (a) => a.status === "Offer" && new Date(a.updated_at || a.created_at).getTime() <= d.getTime()
            ).length;

            return {
                week: `W${idx + 1}`,
                applications: count,
                interviews: interviewCount,
                offers: offerCount
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                counts,
                upcomingInterviews,
                recentApplications,
                growth
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getDashboardData
};
