import { AccessToken } from "livekit-server-sdk";
import { StatusCode } from "../shared/constants/statusCode";
import { config } from "../config";

export class ConferenceService {
    constructor() {

    }

    public async createToken(identity: string, room: string) {
        try {
            if (!identity || !room) {
                return {
                    message: "Missing identity or room",
                    status: StatusCode.BAD_REQUEST
                }
            }
            
            const token = new AccessToken(config.liveKit.apiKey, config.liveKit.apiSecret, {
                identity
            });
            token.addGrant({roomJoin: true, room});
            return {
                message: "Token created",
                status: StatusCode.CREATED,
                token : await token.toJwt()
            }
        } catch (error) {
            console.log(error);
            return {
                message: "Internal server error",
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}