import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs-extra";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
}

export const JSON_STORAGE_DIR = process.env["JSON_STORAGE_DIR"];
export const RESULT_API_ENDPOINT = process.env["RESULT_API_ENDPOINT"];
export const FASTP_BIN = process.env["FASTP_BIN"];
export const PORT = process.env["PORT"];

if (!JSON_STORAGE_DIR) {
    logger.error("No fastq storage directory. Set JSON_STORAGE_DIR environment variable.");
    process.exit(1);
}

if (!RESULT_API_ENDPOINT) {
    logger.error("No result API endpoint set. Set RESULT_API_ENDPOINT environment variable.");
    process.exit(1);
}

if (!FASTP_BIN) {
    logger.error("No fastp binary path set. Set FASTP_BIN environment variable.");
    process.exit(1);
}

fs.ensureDirSync(JSON_STORAGE_DIR);
