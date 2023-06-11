import axios, { AxiosResponse } from "axios";
import { Role } from "../types/role";

const BACKEND_API_URL = "https://backend.mdma.haveachin.de";
const config = {
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 *
 * @param username username
 * @param password password
 * @returns true if login was succesfull
 */
export async function login(
  username: string,
  password: string
): Promise<AxiosResponse> {
  const response = await axios.post(
    BACKEND_API_URL + "/login",
    {
      username: username, //"H4r4ldD3rH4ck3r",
      password: password, //"password123",
    },
    {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  document.cookie =
    "token=" + response.data.token + ";expires=" + response.data.expiresAt + ";path=/";
  return response;
}

export async function logout(): Promise<boolean> {
  const response = await axios.post(BACKEND_API_URL + "/logout", {
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.substring(6)}`
    },
  });
  return response.status === 200;
}

export async function GetTypes(): Promise<String[]> {
  const response = await axios.get(BACKEND_API_URL + "/data/types", {
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.substring(6)}`,
    },
  });
  return response.data;
}

export async function GetUsers(): Promise<String[]> {
  const response = await axios.get(BACKEND_API_URL + "/accounts/users", {
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.substring(6)}`,
    },
  });
  return response.data;
}

export async function GetRoles(): Promise<Role[]> {
  const response = await axios.get(BACKEND_API_URL + "/roles", {
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie.substring(6)}`,
    },
  });
  return response.data;
}