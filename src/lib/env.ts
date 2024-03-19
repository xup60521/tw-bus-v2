import { z } from "zod";

const envSchema = z.object({
    client_id: z.string(),
    client_secret: z.string(),
    UPSTASH_REDIS_REST_URL: z.string(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
});

export const env = envSchema.parse({
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
});
