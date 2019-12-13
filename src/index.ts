import axios from "axios";
import { google } from "googleapis";

export const getAuthToken = async (): Promise<string> => {
  // @ts-ignore
  const auth = new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"]
  });
  const authClient = await auth.getClient();

  // @ts-ignore
  const { access_token: token } = await authClient.authorize();

  return token;
};

export const getSecret = async (
  projectName: string,
  token: string,
  secretName: string
) => {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Goog-User-Project": projectName
    },
    method: "GET" as "GET",
    url: `https://secretmanager.googleapis.com/v1beta1/projects/${projectName}/secrets/${secretName}/versions/1:access`
  };

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
    secrets.map(secret => getSecret(projectName, token, secret))
  );
};
