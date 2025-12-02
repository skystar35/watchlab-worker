
import { Worker } from "bullmq";
import IORedis from "ioredis";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

const TMP_DIR = "/tmp";

const videoWorker = new Worker("videoQueue", async (job) => {
  console.log("🎬 Yeni job alındı:", job.id);

  const inputPath = path.join(__dirname, "assets", "sample.mp4");
  const outputPath = path.join(TMP_DIR, `output_${job.id}.mp4`);
  await fs.mkdir(TMP_DIR, { recursive: true });

  await fs.copyFile(inputPath, outputPath);
  console.log("✅ İşlem tamam:", outputPath);
  return { outputPath };
}, { connection });

console.log("👷 Worker started");
