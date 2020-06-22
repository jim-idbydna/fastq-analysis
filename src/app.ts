import axios from "axios";
import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import { getFastpSummary } from "./fastp";
import logger from "./util/logger";
import { RESULT_API_ENDPOINT, PORT } from "./util/env";

// Create Express server
const app = express();

// Express configuration
app.set("port", PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/analysis", async (req, res) => {
    const fastqPath = req.body.dataLocation;
    logger.info(`Running analysis on ${fastqPath}`);
    res.sendStatus(201);
    try {
        const fastpData = await getFastpSummary(req.body.id, fastqPath);
        logger.info(`Finished analyzing ${fastqPath}`);
        const data = {
            message: "results",
            id: req.body.id,
            results: fastpData,
        };
        await axios.post(RESULT_API_ENDPOINT, data);
    } catch(err) {
        logger.error(err);
        const data = {
            message: "error",
            id: req.body.id,
        };
        axios.post(RESULT_API_ENDPOINT, data).catch(err => {
            logger.error(err);
        });
    }
});

export default app;
