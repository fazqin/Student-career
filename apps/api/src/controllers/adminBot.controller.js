const pool = require("../config/db");

/**
 * Helper to query applications joined with user profiles and position details
 */
async function getApplicationsWithDetails(whereClause = "", params = []) {
    const query = `
            SELECT
            a.id,
            a.user_id,
            a.position_id,
            a.status,
            a.priority,
            a.applied_date,
            a.deadline,
            a.notes,
            a.created_at,
            a.updated_at,
            p.title AS position_title,
            c.name AS company_name,
            COALESCE(pr.full_name, u.email) AS student_name,
            u.email AS student_email,
            COALESCE(u.tier, 'Free') AS tier   -- <--- Tambahkan ini
        FROM applications a
        JOIN positions p ON p.id = a.position_id
        JOIN companies c ON c.id = p.company_id
        JOIN users u ON u.id = a.user_id
        LEFT JOIN profiles pr ON pr.user_id = u.id
        ${whereClause ? `WHERE ${whereClause}` : ""}
        ORDER BY a.updated_at DESC, a.id DESC;
    `;
    const result = await pool.query(query, params);
    return result.rows;
}

/**
 * Smart Resolver: Mencari lamaran spesifik berdasarkan nama user dan posisi/perusahaan
 */
async function resolveTargetApplication(rawUserName, rawPositionTitle, targetId = null) {
    let targetName = (rawUserName || "").trim();
    let targetPosition = (rawPositionTitle || "").trim();

    // 1. Coba cari dengan targetName langsung
    let apps = [];
    if (targetName) {
        apps = await getApplicationsWithDetails(
            "LOWER(COALESCE(pr.full_name, '')) LIKE $1 OR LOWER(u.email) LIKE $1",
            [`%${targetName.toLowerCase()}%`]
        );
    // 2. Jika tidak ketemu dan ada spasi (kemungkinan nama + posisi tergabung, misal "Faza Jhonson Wantimpres")
    if (apps.length === 0 && targetName.length > 2) {
            const words = targetName
                .toLowerCase()
                .split(/\s+/)
                .filter((w) => !["milik", "user", "pelamar", "lamaran", "mahasiswa", "atas", "nama", "id"].includes(w) && w.length >= 3);
            for (const word of words) {
                const matched = await getApplicationsWithDetails(
                    "LOWER(COALESCE(pr.full_name, '')) LIKE $1",
                    [`%${word}%`]
                );
                if (matched.length > 0) {
                    apps = matched;
                    break;
                }
            }
        }
    }
    if (apps.length === 0) {
        return { targetName, targetPosition, targetId, appToUpdate: null, allApps: [] };
    }

    // 3. Jika targetPosition terdeteksi, cari posisi atau perusahaan yang cocok di antara lamaran kandidat tersebut
    let appToUpdate = apps[0];
    if (targetPosition) {
        const matched = apps.find(
            (a) =>
                a.position_title.toLowerCase().includes(targetPosition.toLowerCase()) ||
                a.company_name.toLowerCase().includes(targetPosition.toLowerCase())
        );
        if (matched) {
            appToUpdate = matched;
        }
    }
    return { targetName, targetPosition, targetId, appToUpdate, allApps: apps };
}

/**
 * Status checker for AI Bot
 */
const getBotStatus = async (req, res) => {
    const thirdPartyKey = process.env.TOKEN_API || "";
    const openAiKey = process.env.OPENAI_API_KEY || "";
    const geminiKey = process.env.GEMINI_API_KEY || "";

    const hasThirdParty = Boolean(thirdPartyKey && thirdPartyKey.trim().length > 5);
    const hasOpenAi = Boolean(openAiKey && openAiKey.trim().length > 5);
    const hasGemini = Boolean(geminiKey && geminiKey.trim().length > 5);

    let provider = "Smart Rule Engine (No Key)";
    let model = "heuristic-nlp";

    if (hasThirdParty) {
        provider = "TokenGateway AI";
        model = process.env.AI_MODEL || "deepseek-v4.1-flash";
    } else if (hasOpenAi) {
        provider = "OpenAI";
        model = "gpt-6-astra";
    } else if (hasGemini) {
        provider = "Google Gemini";
        model = "gemini-1.5-flash";
    }

    return res.status(200).json({
        success: true,
        hasKey: hasThirdParty || hasOpenAi || hasGemini,
        provider,
        model,
        connectedDb: true,
    });
};

/**
 * Call OpenAI Chat Completions API (using native fetch, no external SDK needed)
 */
async function callOpenAiApi(apiKey, systemInstruction, userMessage) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const body = {
        model: "gpt-6-astra",
        response_format: { type: "json_object" },
        temperature: 0.1,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userMessage },
        ],
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("No response generated by OpenAI model.");
    }

    return JSON.parse(content);
}

/**
 * Panggil Third-Party AI Gateway (OpenAI-Compatible)
 */
async function callThirdPartyAi(apiKey, systemInstruction, userMessage) {
    const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
    const model = process.env.AI_MODEL || "deepseek-v4.1-flash";

    const body = {
        model: model,
        response_format: { type: "json_object" },
        temperature: 0.1,
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userMessage },
        ],
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Third Party AI Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
        throw new Error("Tidak ada respon konten dari AI.");
    }

    content = content.replace(/```json/gi, "").replace(/```/gi, "").trim();
    return JSON.parse(content);
}


/**
 * Call Gemini 1.5 Flash using raw fetch to avoid external SDK issues
 */
async function callGeminiApi(apiKey, systemInstruction, userMessage) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        system_instruction: {
            parts: [{ text: systemInstruction }],
        },
        contents: [
            {
                role: "user",
                parts: [{ text: userMessage }],
            },
        ],
        generationConfig: {
            temperature: 0.1,
            response_mime_type: "application/json",
        },
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) {
        throw new Error("No response generated by Gemini model.");
    }

    return JSON.parse(candidate);
}

/**
 * Heuristic Natural Language Rule Parser for Indonesian & English
 * Used as reliable fallback if GEMINI_API_KEY is not yet configured
 */
function parseIntentHeuristic(message) {
    const text = message.toLowerCase().trim();


    let extractedId = null;
    const idMatch = message.match(/(?:#|id\s*(?:lamaran)?\s*#?|lamaran\s*#?|nomor\s*#?)(\d+)/i);
    if (idMatch) {
        extractedId = parseInt(idMatch[1], 10);
    }

    // 1. STATS / SUMMARY
    if (text.includes("berapa") || text.includes("total") || text.includes("statistik") || text.includes("rekap") || text.includes("summary")) {
        return {
            intent: "GET_STATISTICS",
            replyTemplate: "Berikut ringkasan statistik lamaran saat ini.",
        };
    }

    // 3. DETEKSI STATUS TUJUAN
    let detectedStatus = null;
    if (/interview/i.test(text)) detectedStatus = "Interview";
    else if (/in\s*review|review/i.test(text)) detectedStatus = "In Review";
    else if (/offer|terima|diterima/i.test(text)) detectedStatus = "Offer";
    else if (/reject|tolak|ditolak/i.test(text)) detectedStatus = "Rejected";
    else if (/applied|daftar/i.test(text)) detectedStatus = "Applied";
    else if (/withdrawn|batal/i.test(text)) detectedStatus = "Withdrawn";
    // 4. UPDATE STATUS (Sangat Fleksibel)
    const isUpdateAction = /(ubah|ganti|set|update|pindahkan|jadikan|menjadi|ke|jadi)/i.test(text);
    if (detectedStatus && (isUpdateAction || extractedId)) {
        // Bersihkan nama dari kata-kata perintah
        let cleanedName = text
            .replace(/(ubah|ganti|set|update|pindahkan|status|id|lamaran|#\d+|\d+|milik|atas\s+nama|user|mahasiswa|menjadi|ke|jadi|to|interview|in\s*review|review|offer|reject|rejected|tolak|withdrawn|applied)/gi, "")
            .trim();
        return {
            intent: "UPDATE_STATUS",
            applicationId: extractedId,
            userName: cleanedName || null,
            newStatus: detectedStatus,
        };
    }
    // 5. UPDATE PRIORITY
    if (/prioritas|priority/i.test(text)) {
        let mappedPriority = "High";
        if (/low|rendah/i.test(text)) mappedPriority = "Low";
        else if (/medium|sedang/i.test(text)) mappedPriority = "Medium";
        let cleanedName = text
            .replace(/(ubah|ganti|set|update|prioritas|priority|id|lamaran|#\d+|\d+|milik|user|ke|jadi|menjadi|high|low|medium|tinggi|rendah|sedang)/gi, "")
            .trim();
        return {
            intent: "UPDATE_PRIORITY",
            applicationId: extractedId,
            userName: cleanedName || null,
            newPriority: mappedPriority,
        };
    }
    // 6. ADD NOTE
    if (text.includes("catatan") || text.includes("note")) {
        const parts = text.split(/[:=]/);
        const noteText = parts[1]?.trim() || "Catatan admin dari Bot";
        const cleanedName = parts[0].replace(/(tambah|tambahkan|catatan|notes?|pada|untuk|lamaran|id|#\d+|\d+|user|milik)/gi, "").trim();
        return {
            intent: "ADD_NOTE",
            applicationId: extractedId,
            userName: cleanedName || null,
            notes: noteText,
        };
    }
    // 7. LIST / SEARCH
    if (/(cari|list|tampilkan|lihat|siapa)/i.test(text)) {
        return {
            intent: "LIST_APPLICATIONS",
            filterStatus: detectedStatus,
            searchQuery: text.replace(/(tampilkan|cari|lihat|list|semua|lamaran|yang|berstatus|status)/gi, "").trim(),
        };
    }
    return {
        intent: "GENERAL_QUERY",
        message,
    };
}

/**
 * Main Controller for Bot Actions
 */
const handleBotMessage = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const thirdPartyKey = process.env.TOKEN_API;
        const openAiKey = process.env.OPENAI_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        let aiParsed = null;
        let usedEngine = "Smart Heuristic NLP";

        const systemPrompt = `
You are the AI Admin Assistant for CareerTrack application management.
Your job is to interpret instructions from the administrator and map them to database actions on student applications in Supabase.

Available Actions:
1. UPDATE_STATUS: Admin wants to change application status. Valid statuses: "Applied", "In Review", "Interview", "Offer", "Rejected", "Withdrawn".
2. UPDATE_PRIORITY: Admin wants to set priority. Valid priorities: "High", "Medium", "Low".
3. ADD_NOTE: Admin wants to attach or update notes for an application.
4. LIST_APPLICATIONS: Admin wants to filter or search applications.
5. GET_STATISTICS: Admin wants summary metrics or counts.
6. GENERAL_QUERY: Conversational queries or help instructions.

JSON Output Schema:
{
"intent": "UPDATE_STATUS" | "UPDATE_PRIORITY" | "ADD_NOTE" | "LIST_APPLICATIONS" | "GET_STATISTICS" | "GENERAL_QUERY",
"applicationId": null or integer (misal dari #80 atau ID 80, isi 80),
"userName": "string or null",
"positionTitle": "string or null",
"newStatus": "Applied" | "In Review" | "Interview" | "Offer" | "Rejected" | "Withdrawn" | null,
"newPriority": "High" | "Medium" | "Low" | null,
"notes": "string or null",
"filterStatus": "string or null",
"replyMessage": "Polite Indonesian response confirming or answering"
}
`;

        

                if (thirdPartyKey && thirdPartyKey.trim().length > 5) {
            try {
                aiParsed = await callThirdPartyAi(thirdPartyKey, systemPrompt, message);
                usedEngine = `TokenGateway (${process.env.AI_MODEL || "deepseek-v4.1-flash"})`;
            } catch (err) {
                console.warn("Third-Party AI gagal, beralih ke heuristic:", err.message);
                aiParsed = parseIntentHeuristic(message);
                usedEngine = "Smart Heuristic NLP (Fallback)";
            }
        } else if (openAiKey && openAiKey.trim().length > 5) {
            try {
                aiParsed = await callOpenAiApi(openAiKey, systemPrompt, message);
                usedEngine = "OpenAI GPT-6-astra";
            } catch (openAiError) {
                console.warn("OpenAI API call failed, falling back to heuristic parser:", openAiError.message);
                aiParsed = parseIntentHeuristic(message);
                usedEngine = "Smart Heuristic NLP (OpenAI Fallback)";
            }
        } else if (geminiKey && geminiKey.trim().length > 5) {
            try {
                aiParsed = await callGeminiApi(geminiKey, systemPrompt, message);
                usedEngine = "Google Gemini 1.5 Flash";
            } catch (geminiError) {
                console.warn("Gemini API call failed, falling back to heuristic parser:", geminiError.message);
                aiParsed = parseIntentHeuristic(message);
                usedEngine = "Smart Heuristic NLP (Gemini Fallback)";
            }
        } else {
            aiParsed = parseIntentHeuristic(message);
            usedEngine = "Smart Heuristic NLP (No API Key)";
        }


        // =========================================================================
        // EXECUTE INTENT AGAINST SUPABASE POSTGRES DATABASE
        // =========================================================================

        const intent = aiParsed.intent;

        // --- 1. UPDATE STATUS ---
                if (intent === "UPDATE_STATUS") {
            const rawName = aiParsed.userName || "";
            const rawPosition = aiParsed.positionTitle || "";
            const rawId = aiParsed.applicationId || null;
            const targetStatus = aiParsed.newStatus || "Interview";

            // Gunakan Smart Resolver dengan rawId
            const { targetName, targetPosition, targetId, appToUpdate } = await resolveTargetApplication(rawName, rawPosition, rawId);

            if (!appToUpdate) {
                return res.status(200).json({
                    success: true,
                    aiEngine: usedEngine,
                    reply: `Saya tidak menemukan lamaran ${rawId ? `dengan ID #${rawId}` : `untuk "${rawName}"`}. Pastikan data terdaftar di sistem.`,
                    actionsTaken: [],
                    data: [],
                });
            }

            const oldStatus = appToUpdate.status;

            await pool.query(
                `UPDATE applications SET status = $1, updated_at = NOW() WHERE id = $2`,
                [targetStatus, appToUpdate.id]
            );

            const freshList = await getApplicationsWithDetails("a.id = $1", [appToUpdate.id]);

            return res.status(200).json({
                success: true,
                aiEngine: usedEngine,
                reply: `Berhasil mengubah status lamaran #${appToUpdate.id} (${appToUpdate.student_name} - ${appToUpdate.position_title}) dari "${oldStatus}" menjadi "${targetStatus}".`,
                actionsTaken: [
                    {
                        type: "UPDATE_STATUS",
                        applicationId: appToUpdate.id,
                        studentName: appToUpdate.student_name,
                        studentEmail: appToUpdate.student_email,
                        companyName: appToUpdate.company_name,
                        positionTitle: appToUpdate.position_title,
                        oldValue: oldStatus,
                        newValue: targetStatus,
                        timestamp: new Date().toISOString(),
                    },
                ],
                data: freshList,
            });
        }


        // --- 2. UPDATE PRIORITY ---
        if (intent === "UPDATE_PRIORITY") {
            const rawName = aiParsed.userName || "";
            const rawPosition = aiParsed.positionTitle || "";
            const targetPriority = aiParsed.newPriority || "High";

            const { appToUpdate } = await resolveTargetApplication(rawName, rawPosition);
            if (!appToUpdate) {
                return res.status(200).json({
                    success: true,
                    aiEngine: usedEngine,
                    reply: `Tidak ditemukan lamaran untuk pengguna "${rawName}".`,
                    actionsTaken: [],
                    data: [],
                });
            }

            const oldPriority = appToUpdate.priority;

            await pool.query(
                `UPDATE applications SET priority = $1, updated_at = NOW() WHERE id = $2`,
                [targetPriority, appToUpdate.id]
            );

            const freshList = await getApplicationsWithDetails("a.id = $1", [appToUpdate.id]);

            return res.status(200).json({
                success: true,
                aiEngine: usedEngine,
                reply: aiParsed.replyMessage || `Prioritas lamaran ${appToUpdate.student_name} berhasil diubah dari "${oldPriority}" menjadi "${targetPriority}".`,
                actionsTaken: [
                    {
                        type: "UPDATE_PRIORITY",
                        applicationId: appToUpdate.id,
                        studentName: appToUpdate.student_name,
                        positionTitle: appToUpdate.position_title,
                        oldValue: oldPriority,
                        newValue: targetPriority,
                        timestamp: new Date().toISOString(),
                    },
                ],
                data: freshList,
            });
        }

        // --- 3. ADD NOTE ---
        if (intent === "ADD_NOTE") {
            const targetName = aiParsed.userName || "";
            const newNote = aiParsed.notes || "Catatan admin diperbarui oleh Bot";

            const apps = await getApplicationsWithDetails(
                "LOWER(COALESCE(pr.full_name, '')) LIKE $1 OR LOWER(u.email) LIKE $1",
                [`%${targetName.toLowerCase()}%`]
            );

            if (apps.length === 0) {
                return res.status(200).json({
                    success: true,
                    aiEngine: usedEngine,
                    reply: `Tidak dapat menambahkan catatan karena user "${targetName}" tidak ditemukan.`,
                    actionsTaken: [],
                    data: [],
                });
            }

            const appToUpdate = apps[0];
            await pool.query(
                `UPDATE applications SET notes = $1, updated_at = NOW() WHERE id = $2`,
                [newNote, appToUpdate.id]
            );

            const freshList = await getApplicationsWithDetails("a.id = $1", [appToUpdate.id]);

            return res.status(200).json({
                success: true,
                aiEngine: usedEngine,
                reply: `Catatan baru untuk ${appToUpdate.student_name} berhasil disimpan: "${newNote}".`,
                actionsTaken: [
                    {
                        type: "ADD_NOTE",
                        applicationId: appToUpdate.id,
                        studentName: appToUpdate.student_name,
                        newValue: newNote,
                        timestamp: new Date().toISOString(),
                    },
                ],
                data: freshList,
            });
        }

        // --- 4. LIST / FILTER APPLICATIONS ---
        if (intent === "LIST_APPLICATIONS") {
            const filterStatus = aiParsed.filterStatus || null;
            let where = "";
            let params = [];

            if (filterStatus) {
                where = "a.status ILIKE $1";
                params = [filterStatus];
            }

            const results = await getApplicationsWithDetails(where, params);

            return res.status(200).json({
                success: true,
                aiEngine: usedEngine,
                reply: `Ditemukan ${results.length} data lamaran ${filterStatus ? `dengan status "${filterStatus}"` : ""}. Anda juga dapat mengklik langsung kartu data untuk melihat atau mengedit manual.`,
                actionsTaken: [],
                data: results.slice(0, 10),
            });
        }

        // --- 5. GET STATISTICS ---
        if (intent === "GET_STATISTICS") {
            const statQuery = `
                SELECT
                    COUNT(*) AS total_applications,
                    COUNT(*) FILTER (WHERE status = 'Applied') AS applied_count,
                    COUNT(*) FILTER (WHERE status = 'Interview') AS interview_count,
                    COUNT(*) FILTER (WHERE status = 'In Review') AS review_count,
                    COUNT(*) FILTER (WHERE status = 'Offer') AS offer_count,
                    COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected_count,
                    COUNT(*) FILTER (WHERE priority = 'High') AS high_priority_count
                FROM applications;
            `;
            const stats = await pool.query(statQuery);
            const row = stats.rows[0];

            const reply = `📊 **Ringkasan Aplikasi Mahasiswa:**\n` +
                `- Total Lamaran: **${row.total_applications}**\n` +
                `- Applied: **${row.applied_count}**\n` +
                `- In Review: **${row.review_count}**\n` +
                `- Interview: **${row.interview_count}**\n` +
                `- Offer: **${row.offer_count}**\n` +
                `- Rejected: **${row.rejected_count}**\n` +
                `- Prioritas Tinggi: **${row.high_priority_count}**`;

            return res.status(200).json({
                success: true,
                aiEngine: usedEngine,
                reply,
                actionsTaken: [],
                data: [row],
            });
        }

        // --- 6. GENERAL CONVERSATION OR HELP ---
        const helpReply = aiParsed.replyMessage ||
            `Halo Admin! Saya adalah asisten Bot untuk Application Management. Anda bisa memberi saya perintah seperti:\n` +
            `• *"Ganti status lamaran Faza menjadi Interview"*\n` +
            `• *"Ubah status lamaran uswa menjadi Offer"*\n` +
            `• *"Set prioritas lamaran Yanto jadi High"*\n` +
            `• *"Tolak lamaran afni"* atau *"Tampilkan semua lamaran status Applied"*\n` +
            `• *"Berapa total lamaran yang masuk?"*`;

        return res.status(200).json({
            success: true,
            aiEngine: usedEngine,
            reply: helpReply,
            actionsTaken: [],
            data: [],
        });
    } catch (error) {
        console.error("Error in handleBotMessage:", error);
        return res.status(500).json({
            success: false,
            message: "Gagal memproses pesan bot: " + error.message,
        });
    }
};

/**
 * Controller to fetch all applications directly for admin preview
 */
const getBotApplicationsPreview = async (req, res, next) => {
    try {
        const applications = await getApplicationsWithDetails();
        return res.status(200).json({
            success: true,
            data: applications,
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    handleBotMessage,
    getBotStatus,
    getBotApplicationsPreview,
};
