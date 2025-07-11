import axios from "axios";
import { config } from "../../config";
import { IUser } from "../types/IUser";
import logger from "./logger";

interface FetchUsersResponse {
  users: IUser[];
}

export const fetchUsers = async (userIds: string[]): Promise<Record<string, IUser>> => {
  try {
    const res = await axios.post<FetchUsersResponse>(`${config.services.user}/bulk/users`, {
      ids: userIds,
    });

    const users = res.data.users;

    return users.reduce((acc: Record<string, IUser>, user: IUser) => {
      acc[user.id as string] = user;
      return acc;
    }, {});
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error("User Service Error:", err.message);
    } else {
      logger.error("Unknown error while fetching users");
    }
    return {};
  }
};
