import axios from "axios";
import { config } from "../../config";
import { IUser } from "../types/IUser";

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
      console.error("User Service Error:", err.message);
    } else {
      console.error("Unknown error while fetching users");
    }
    return {};
  }
};
