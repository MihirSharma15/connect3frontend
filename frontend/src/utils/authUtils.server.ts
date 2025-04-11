import { cookies } from "next/headers";

export const getAuthTokenServer = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_token");
  return authCookie ? authCookie.value : null;
};
