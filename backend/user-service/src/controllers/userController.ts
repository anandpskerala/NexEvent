import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { IUser } from "../shared/types/user";
import { StatusCode } from "../shared/constants/statusCode";
import { TOPICS } from "../kafka/topics";
import { UserProducer } from "../kafka/producer/userProducer";


export class UserController {
    constructor(public userService: UserService, private producer: UserProducer<IUser>) {}

    public getUser = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const result = await this.userService.getUserDetails(id);
        res.status(result.status).json({message: result.message, user: result.user});
    }

    public verifyUser = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const result = await this.userService.verifyUser(userId);
        res.status(result.status).json({ user: result.user });
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        const { query = "", page = 1, limit = 10, role = "", status = "", myId } = req.query;
        const result = await this.userService.getAllUsers(query as string, page as number, limit as number, role as string, status as string, myId as string);
        res.status(result.status).json({users: result.users, page: result.page, pages: result.pages, total: result.total})
    }

    public updateProfile = async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, phoneNumber } = req.body;
        const result = await this.userService.updateProfile(email, firstName, lastName, phoneNumber);
        res.status(result.status).json({message: result.message, user: result.user});
    }

    public updateProfileImage = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const { image } = req.body;
        const result = await this.userService.updateProfileImage(userId as string, image);
        res.status(result.status).json({message: result.message, user: result.user});
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        const { email, firstName, lastName, phoneNumber, roles, isBlocked } = req.body;
        const result = await this.userService.updateUser(email, firstName, lastName, phoneNumber, roles, isBlocked);
        res.status(result.status).json({message: result.message});
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.userService.deleteUser(id);
        if (result.status === StatusCode.OK && result.user) {
            this.producer.sendData(TOPICS.USER_DELETED, result.user)
        }
        res.status(result.status).json({message: result.message});
    }

    public getBulkUsers = async (req: Request, res: Response): Promise<void> => {
        const { ids } = req.body;
        const result = await this.userService.getUsersBulk(ids);
        res.status(result.status).json({message: result.message, users: result.users});
    }
}