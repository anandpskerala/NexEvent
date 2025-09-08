import { ConferenceReturnType } from "../../shared/types/ReturnType";

export interface IConferenceService {
    createToken(identity: string, room: string): Promise<ConferenceReturnType>;
}