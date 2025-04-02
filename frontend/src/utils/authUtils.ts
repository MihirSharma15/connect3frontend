"use client";

// Cookie utility functions
export const setAuthCookie = (token: string) => {
  const cookieOptions = [
    `max-age=${60 * 60 * 24 * 7}`,
    "path=/", 
    "samesite=lax",
    process.env.NODE_ENV === "production" ? "secure" : ""
  ].join("; ");
  
  document.cookie = `auth_token=${token}; ${cookieOptions}`;
};

export const getAuthToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('auth_token='))
    ?.split('=')[1];
};

export const removeAuthCookie = () => {
  document.cookie = 'auth_token=; max-age=0; path=/;';
};
