import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://krewbill.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/login",
    "/signup",
    "/vs-jobber",
    "/vs-housecall-pro",
    "/best-invoicing-software-for-trades",
    "/krewbill-for-electricians",
    "/krewbill-for-plumbers",
    "/krewbill-for-hvac-contractors",
    "/krewbill-for-handymen",
    "/krewbill-for-landscapers",
    "/krewbill-for-roofers",
    "/jobber-alternative-for-electricians",
    "/jobber-alternative-for-plumbers",
    "/housecall-pro-alternative-for-hvac",
    "/jobber-alternative-for-handymen",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
