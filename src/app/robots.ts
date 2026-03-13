export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/admin/",
      },
    ],
    sitemap: "https://imoveismae.vercel.app/sitemap.xml",
  };
}
