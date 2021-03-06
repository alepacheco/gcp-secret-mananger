import axios from "axios";
import { google } from "googleapis";

export const getAuthToken = async (): Promise<string | null> => {
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"]
  });
  const authClient = await auth.getClient();
  const { token } = await authClient.getAccessToken();
  
  return token || null;
};

export const getSecret = async (
  projectName: string,
  secretName: string,
  token?: string | null
) => {
  const options = {
    headers: {
      "X-Goog-User-Project": projectName
    } as any,
    method: "GET" as "GET",
    url: `https://secretmanager.googleapis.com/v1beta1/projects/${projectName}/secrets/${secretName}/versions/1:access`
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  const { data: responseData } = await axios(options);
  const {
    payload: { data: secretDataBase64 }
  } = responseData;

  const buff = Buffer.from(secretDataBase64, "base64");
  const text = buff.toString("ascii");

  process.env[secretName] = text;
};

export const getSecrets = async (projectName: string, secrets: string[]) => {
  const token = await getAuthToken();

  await Promise.all(
    secrets.map(secret => getSecret(projectName, secret, token))
  );
};
