import crypto from "crypto";

export const generateQueryKey = (obj: object): string => {
  return crypto.createHash("md5").update(JSON.stringify(obj)).digest("hex");
}
