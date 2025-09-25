import proxy from "express-http-proxy";
import { RequestOptions } from 'http';
import { Request, RequestHandler, Response } from "express";
import { IServiceResolver } from "../interfaces/IServiceResolver";
import { StatusCode } from "../../shared/constants/statusCode";
import { config } from "../../config";


export class ServiceResolver implements IServiceResolver {
    private serviceMap: Record<string, string>;

    constructor(serviceMap: Record<string, string>) {
        this.serviceMap = serviceMap;
    }

    resolve(serviceName: string): RequestHandler {
        const url = this.serviceMap[serviceName];
        if (!url) throw new Error(`Service ${serviceName} not found in static map`);

        const proxyMiddleware = proxy(url, {
            proxyReqPathResolver: (req: Request): string => {
                return req.originalUrl.replace(/^\/api\/[a-zA-Z0-9_-]+/, '');
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
                proxyReqOpts.headers = {
                    ...proxyReqOpts.headers,
                    'x-internal-token': config.internalToken
                }

                return proxyReqOpts;
            },

            proxyErrorHandler: (err: unknown, res: Response) => {
                console.log('Proxy Error : ', err);
                res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal proxy error" })
            }
        })
        return proxyMiddleware;
    }
}