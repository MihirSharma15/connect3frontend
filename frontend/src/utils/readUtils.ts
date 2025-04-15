"use client";

// Cookie utility functions
export const setReadCookie: (document: Document, time?: number) => void = (document: Document, time: number | undefined) => {
  const cookieOptions = [
    `max-age=${60 * 60 * 24 * 7}`,
    "path=/", 
    "samesite=lax",
    process.env.NODE_ENV === "production" ? "secure" : ""
  ].join("; ");
  document.cookie = `last_read_at=${time || Date.now()}; ${cookieOptions}`;
};

export const getReadCookie: (document: Document) => string = (document: Document) => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('last_read_at='))
    ?.split('=')[1];
    if (!cookie) setReadCookie(document, Date.now() - 86400000);
    return cookie || (Date.now() - 86400000).toString();
};