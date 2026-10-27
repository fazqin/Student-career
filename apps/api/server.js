const app = require("./app");
const { cleanupOldWithdrawnApplications } = require("./src/jobs/cleanup.job");

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
      // Jalankan 1x saat server start, lalu jadwalkan berkala
    cleanupOldWithdrawnApplications();
    setInterval(cleanupOldWithdrawnApplications, 24 * 60 * 60 * 1000); // Cek setiap 24 jam
});