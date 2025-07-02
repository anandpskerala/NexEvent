import { RequestOptions } from 'http';
import proxy from "express-http-proxy";
import { config } from '../../config';
import { Request, Response } from "express";
import { StatusCode } from '../../shared/constants/statusCode';

export class AdminProxy {
    public static setupProxy() {
        const serviceUrl = config.services.admin;
        return proxy(serviceUrl, {
            proxyReqPathResolver: (req: Request): string => {
                return req.originalUrl.replace(/^\/api\/admin/, '');
            },


            proxyReqOptDecorator: (proxyReqOpts: RequestOptions, srcReq: Request): RequestOptions => {
                if (srcReq.headers['x-user-id']) {
                    proxyReqOpts.headers = {
                        ...proxyReqOpts.headers,
                        'x-user-id': srcReq.headers['x-user-id'],
                    };
                }

                if (srcReq.headers['x-user-roles']) {
                    proxyReqOpts.headers = {
                        ...proxyReqOpts.headers,
                        'x-user-roles': srcReq.headers['x-user-roles'],
                    };
                }

                return proxyReqOpts;
            },

            proxyErrorHandler: (err: unknown, res: Response) => {
                console.log('Proxy Error : ', err);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal proxy error" })
            }
        })
    }
}