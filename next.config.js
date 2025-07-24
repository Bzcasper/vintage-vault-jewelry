/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
  transpilePackages: ["lucide-react"],
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_BUCKET_NAME: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    WEAVIATE_URL: process.env.WEAVIATE_URL,
    WEAVIATE_API_KEY: process.env.WEAVIATE_API_KEY,
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    MODAL_TOKEN_ID: process.env.MODAL_TOKEN_ID,
    MODAL_TOKEN_SECRET: process.env.MODAL_TOKEN_SECRET,
    MODAL_ENDPOINT: process.env.MODAL_ENDPOINT,
    JINA_API_KEY: process.env.JINA_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    GITHUB_USERNAME: process.env.GITHUB_USERNAME,
    GITHUB_EMAIL: process.env.GITHUB_EMAIL,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
};

module.exports = nextConfig;


