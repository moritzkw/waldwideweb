import axios, { AxiosResponse } from "axios";
import { Role } from "../types/role";
import { Data } from "../types/data";
import { SingleData } from "../types/singleData";
import { AggregateFunction } from "../types/aggregateFunction";
import { AggregatedData } from "../types/aggregatedData";
import { Area } from "../types/area";
import { User } from "../types/user";

const BACKEND_API_URL = "https://backend.mdma.haveachin.de";
const config = {
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${document.cookie.substring(6)}`,
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
    "token=" +
    response.data.token +
    ";expires=" +
    response.data.expiresAt +
    ";path=/";
  return response;
}

export async function logout(): Promise<boolean> {
  return await axios.delete(BACKEND_API_URL + "/logout", config)
    .then(response => response.status === 200)
    .catch(() => false);
}

export async function GetTypes(): Promise<string[]> {
  return await axios.get(BACKEND_API_URL + "/data/types", config)
    .then(response => response.data)
    .catch(() => []);
}

export async function GetUsers(): Promise<String[]> {
  return await axios.get(BACKEND_API_URL + "/accounts/users", config)
    .then(response => response.data)
    .catch(() => []);
}

export async function AddUser(username: string, password: string, roleId: number): Promise<boolean> {
  return await axios.post(BACKEND_API_URL + "/accounts/users", {
    username: username,
    password: password,
    roleId: roleId
  }, config)
    .then(response => response.status === 201)
    .catch(() => false);
}

export async function UpdateUser(user: User, username: string, roleId: number, password?: string): Promise<boolean> {
  const params = password ? {
    username: username,
    password: password,
    roleId: roleId
  } : {
    username: username,
    roleId: roleId
  }

  return await axios.put(BACKEND_API_URL + `/accounts/users/${user.id}`, params, config)
    .then(response => response.status === 200)
    .catch(() => false);
}

export async function DeleteUser(user: User): Promise<boolean> {
  return await axios.delete(BACKEND_API_URL + `/accounts/users/${user.id}`, config)
    .then(response => response.status === 204)
    .catch(() => false);
}

export async function GetRoles(): Promise<Role[]> {
  return await axios.get(BACKEND_API_URL + "/roles", config)
    .then(response => response.data)
    .catch(() => []);
}

export async function GetData(
  type: string,
  meshNodes?: string[],
  measuredStart?: Date,
  measuredEnd?: Date
): Promise<Data> {
  let requestUrl = `${BACKEND_API_URL}/data?type=${type}`;
  if (meshNodes)
    meshNodes.forEach((meshNode) => (requestUrl += `&meshNodes=${meshNode}`));
  if (measuredStart)
    requestUrl += `&measuredStart=${measuredStart.toISOString()}`;
  if (measuredEnd) requestUrl += `&measuredEnd=${measuredEnd.toISOString()}`;

  return await axios.get(encodeURI(requestUrl), config)
    .then(response => response.data)
    .catch(() => {});
}

export async function GetAggregatedData(
  type: string,
  aggregateFunction: AggregateFunction,
  meshNodes?: string[],
  measuredStart?: Date,
  measuredEnd?: Date,
  sampleDuration?: string, // format: 4h12m3s
  sampleCount?: number
): Promise<AggregatedData> {
  let requestUrl = `${BACKEND_API_URL}/data/aggregated?type=${type}&aggregateFunction=${aggregateFunction}`;
  if (meshNodes)
    meshNodes.forEach((meshNode) => (requestUrl += `&meshNodes=${meshNode}`));
  if (measuredStart)
    requestUrl += `&measuredStart=${measuredStart.toISOString()}`;
  if (measuredEnd) requestUrl += `&measuredEnd=${measuredEnd.toISOString()}`;
  if (sampleDuration) requestUrl += `&sampleDuration=${sampleDuration}`;
  if (sampleCount) requestUrl += `&sampleCount=${sampleCount}`;

  return await axios.get(encodeURI(requestUrl), config)
    .then(response => response.data)
    .catch(() => {});
}

export async function GetSingleData(uuid: string): Promise<SingleData> {
  return await axios.get(BACKEND_API_URL + `/data/${uuid}`, config)
    .then(response => response.data)
    .catch(() => {});
}

export async function GetNodes(): Promise<Node[]> {
  return await axios.get(BACKEND_API_URL + "/mesh-nodes", config)
    .then(response => response.data)
    .catch(() => []);
}

export async function GetAreas(): Promise<Area[]> {
  return await axios.get(BACKEND_API_URL + "/areas", config)
    .then(response => response.data)
    .catch(() => []);
}
