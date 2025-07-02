import { AccessToken } from "livekit-server-sdk";
import { StatusCode } from "../../shared/constants/statusCode";
import { config } from "../../config";
import logger from "../../shared/utils/logger";
import { HttpResponse } from "../../shared/constants/httpResponse";

export class ConferenceService {
    constructor() {

    }

    public async createToken(identity: string, room: string) {
        try {
            if (!identity || !room) {
                return {
                    message: HttpResponse.IDENTITY_MISSING,
                    status: StatusCode.BAD_REQUEST
                }
            }
            
            const token = new AccessToken(config.liveKit.apiKey, config.liveKit.apiSecret, {
                identity
            });
            token.addGrant({roomJoin: true, room});
            return {
                message: HttpResponse.TOKEN_CREATED,
                status: StatusCode.CREATED,
                token : await token.toJwt()
            }
        } catch (error) {
            logger.error(error);
            return {
                message: HttpResponse.INTERNAL_SERVER_ERROR,
                status: StatusCode.INTERNAL_SERVER_ERROR
            }
        }
    }
}