import axios from "axios";
import config from "../config/config";

export const fetchAccessToken = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    await axios.post(
        `${config.backendUrl}/user/auth/token/refresh`,
        {},
        {
            withCredentials: true,
            signal: controller.signal,
        }
    );
    clearTimeout(timeoutId);
}