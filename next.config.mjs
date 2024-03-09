/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});
/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['jotai-devtools'],
};

export default withPWA(config);
