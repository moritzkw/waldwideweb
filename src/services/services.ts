import axios from "axios";

const BACKEND_API_URL = "https://backend.mdma.haveachin.de";
const config = {
  mode: 'no-cors',
  headers: {
    "Content-Type": "application/json"
  },
};

/**
 * 
 * @param username username
 * @param password password
 * @returns true if login was succesfull
 */
export async function login(username: string, password: string): Promise<boolean> {
  const response = await axios
    .post(BACKEND_API_URL + "/login", {
        username: username,//"H4r4ldD3rH4ck3r",
        password: password, //"password123",
      }, config);
  return response.status === 200;
}

export async function logout(): Promise<boolean> {const response = await axios
  .post(BACKEND_API_URL + "/logout", config);
return response.status === 200;
}
