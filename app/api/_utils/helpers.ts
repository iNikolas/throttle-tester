import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { v4 as uuidv4 } from "uuid";

import { getEnvVar } from "@/utils";

const CLIENT_ID_COOKIE_NAME = getEnvVar("CLIENT_ID_COOKIE_NAME");

export function signClientCookie(cookies: ReadonlyRequestCookies) {
  const clientId = cookies.get(CLIENT_ID_COOKIE_NAME)?.value;

  if (!clientId) {
    const newClientId = uuidv4();

    cookies.set({
      name: CLIENT_ID_COOKIE_NAME,
      value: newClientId,
      httpOnly: true,
      secure: true,
    });
  }
}
