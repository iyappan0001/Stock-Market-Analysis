const cron = require("node-cron");
const priceUpdater = require("../services/priceUpdater");

let scheduledJobs = [];

/**
 * Start all scheduled cron jobs
 * Daily job: 4 PM IST (16:00)
 * Hourly job: For development testing (can be disabled in production)
 */
function startAllJobs() {
  console.log("[ScheduledJobs] Initializing scheduled jobs...");

  // Daily price update job: Every day at 4:00 PM IST (16:00)
  const dailyJob = cron.schedule("0 16 * * *", async () => {
    console.log("[ScheduledJobs] Running daily price update job...");
    const result = await priceUpdater.updateAllStockPrices();
    console.log("[ScheduledJobs] Daily job result:", result);
  });

  scheduledJobs.push({
    name: "Daily Price Update",
    job: dailyJob,
    schedule: "0 16 * * * (4:00 PM IST daily)",
  });

  // Hourly price update job: For development and testing
  // Comment out this job in production if not needed
  const hourlyJob = cron.schedule("0 * * * *", async () => {
    console.log("[ScheduledJobs] Running hourly price update job (dev mode)...");
    const result = await priceUpdater.updateAllStockPrices();
    console.log("[ScheduledJobs] Hourly job result:", result);
  });

  scheduledJobs.push({
    name: "Hourly Price Update (Dev)",
    job: hourlyJob,
    schedule: "0 * * * * (every hour)",
  });

  console.log("[ScheduledJobs] Scheduled jobs started successfully:");
  scheduledJobs.forEach((job) => {
    console.log(`  - ${job.name}: ${job.schedule}`);
  });
}

/**
 * Stop all scheduled cron jobs
 * Call this on server shutdown to gracefully stop all jobs
 */
function stopAllJobs() {
  console.log("[ScheduledJobs] Stopping all scheduled jobs...");
  scheduledJobs.forEach((job) => {
    job.job.stop();
    console.log(`  - Stopped: ${job.name}`);
  });
  scheduledJobs = [];
  console.log("[ScheduledJobs] All jobs stopped.");
}

/**
 * Get status of all scheduled jobs
 */
function getJobsStatus() {
  return {
    totalJobs: scheduledJobs.length,
    jobs: scheduledJobs.map((job) => ({
      name: job.name,
      schedule: job.schedule,
      running: !job.job.stop, // Approximate check
    })),
    timestamp: new Date(),
  };
}

module.exports = {
  startAllJobs,
  stopAllJobs,
  getJobsStatus,
};
