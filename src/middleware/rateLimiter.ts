// middleware/rateLimiter.ts
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // Limit each IP to 10 requests per `window` (here, per 1 minute).
  headers: true, // Enable headers for request limiting information
});

export default limiter;
