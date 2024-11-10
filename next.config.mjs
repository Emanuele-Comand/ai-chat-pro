/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
  },
};

export default nextConfig;
