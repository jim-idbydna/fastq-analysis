import { spawn } from "child_process";
import { FASTP_BIN } from "./util/env";
import logger from "./util/logger";
import { readJson } from "fs-extra";

export function getFastpSummary(id: string, fastqPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const jsonOut = `${id}.json`;
        const params = [
            "-ALGQ",
            "-j", jsonOut,
            "-i", fastqPath,
        ];

        try {
            const fastp = spawn(FASTP_BIN, params);
            fastp.stdout.on("data", (data) => {
                // prepend all lines with "fastp: "
                const dataString: string = data.toString();
                const msg = dataString.split("\n").map(line => "fastp: "+line).join("\n");
                logger.debug(msg);
            });
    
            fastp.stderr.on("data", (data) => {
                // prepend all lines with "fastp: "
                const dataString: string = data.toString();
                const msg = dataString.split("\n").map(line => "fastp: "+line).join("\n");
                logger.debug(msg);
            });
    
            fastp.on("close", (code) => {
                fastp.removeAllListeners();
                fastp.kill();
                if (code !== 0) {
                    return reject(new Error(`fastp terminated with exit code ${code}`));
                }
                readJson(jsonOut, (err, data) => {
                    if(err || ! data["summary"]) {
                        return reject(new Error(`Invalid fastp JSON ${jsonOut}`));
                    }
                    resolve(data["summary"]["before_filtering"]);
                });
            });

            fastp.on("error", (err) => {
                reject(err);
            });
        } catch(err) {
            reject(err);
        }
    });
}