import { IUser } from "../../../shared/types/IUser";
import { WalletRepository } from "../../../repositories/WalletRepository";

export class Handler {
    constructor(private repo: WalletRepository) {}

    async handleNewUser(data: IUser) {
        await this.repo.create({
            userId: data.id
        })
    }

    async handleDelete(data: IUser) {
        await this.repo.delete(data.id as string);
    }
}