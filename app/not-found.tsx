"use client";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Notes App",
  description: "The page you are looking for does not exist in the Notes App.",
  openGraph: {
    title: "404 - Page Not Found | Notes App",
    description:
      "The page you are looking for does not exist in the Notes App.",
    url: "https://vercel.com/marynas-projects-3f5c6324/08-zustand/404",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 600,
        height: 300,
        alt: "404 page preview",
      },
    ],
  },
};

import css from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </>
  );
}
