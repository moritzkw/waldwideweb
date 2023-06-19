import axios, { AxiosResponse } from "axios";
import { Role } from "../types/role";
import { Data } from "../types/data";
import { SingleData } from "../types/singleData";
import { AggregateFunction } from "../types/aggregateFunction";
import { AggregatedData } from "../types/aggregatedData";
import { Area } from "../types/area";

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
  const response = await axios.post(BACKEND_API_URL + "/logout", config);
  return response.status === 200;
}

export async function GetTypes(): Promise<string[]> {
  const response = await axios.get(BACKEND_API_URL + "/data/types", config);
  return response.data;
}

export async function GetUsers(): Promise<String[]> {
  const response = await axios.get(BACKEND_API_URL + "/accounts/users", config);
  return response.data;
}

export async function GetRoles(): Promise<Role[]> {
  const response = await axios.get(BACKEND_API_URL + "/roles", config);
  return response.data;
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
    requestUrl += `&measuredStart=${measuredStart.toUTCString()}`;
  if (measuredEnd) requestUrl += `&measuredEnd=${measuredEnd.toUTCString()}`;

  const response = await axios.get(encodeURI(requestUrl), config);
  return response.data;
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
    requestUrl += `&measuredStart=${measuredStart.toUTCString()}`;
  if (measuredEnd) requestUrl += `&measuredEnd=${measuredEnd.toUTCString()}`;
  if (sampleDuration) requestUrl += `&sampleDuration=${sampleDuration}`;
  if (sampleCount) requestUrl += `&sampleCount=${sampleCount}`;

  const response = await axios.get(encodeURI(requestUrl), config);
  return response.data;
}

export async function GetSingleData(uuid: string): Promise<SingleData> {
  const response = await axios.get(BACKEND_API_URL + `/data/${uuid}`, config);
  return response.data;
}

export async function GetNodes(): Promise<Node[]> {
  const response = await axios.get(BACKEND_API_URL + "/mesh-nodes", config);
  console.debug(response.data)
  return response.data;
}

export async function GetAreas(): Promise<Area[]> {
  const response = await axios.get(BACKEND_API_URL + "/areas", config);
  console.debug(response.data)
  return response.data;
}
