import { Request, Response, NextFunction } from "express";

const DEFAULT_LIMIT = 100;
const MINUTES = 1000 * 60;
const DEFAULT_INTERVAL = MINUTES * 15;

interface IpLimitingOptions {
  limit?: number;
  resetInterval?: number;
}

let ipHitsMap: { [key: string]: number } = {};

const resetIpHitsMap =  () => {
  console.log("Reset ipHitMap");
  ipHitsMap = {};
};

const startResetInterval = (interval: number) => {
  setInterval(() => resetIpHitsMap(), interval);
};

const ipLimiting = ({
  limit = DEFAULT_LIMIT,
  resetInterval = DEFAULT_INTERVAL,
}: IpLimitingOptions = {}) => {
  startResetInterval(resetInterval);

  return (req: Request, res: Response, next: NextFunction) => {
    const requesterIp = String(
      req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "unknown"
    );

    if (!ipHitsMap[requesterIp]) {
      ipHitsMap[requesterIp] = 1;
    } else {
      ipHitsMap[requesterIp] = ipHitsMap[requesterIp] + 1;
    }

    if (ipHitsMap[requesterIp] > limit) {
      const rate = resetInterval / MINUTES;
      res
        .status(429)
        .send(
          `Your IP has exceeded the ${limit} request limit per ${rate} minute(s). Try again in ${rate} minute(s).`
        );
      return;
    }

    next();
  };
};

export default ipLimiting;
