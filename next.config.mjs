/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ARL Radar is a static lead-magnet — no server state, no DB. Export-friendly.
  // (Kept as a normal Next app so the scan wizard can stay a client component and
  //  the dataset can later be served from an API route for the OSS endpoint.)
};

export default nextConfig;
