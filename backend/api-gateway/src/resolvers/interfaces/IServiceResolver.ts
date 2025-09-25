import { RequestHandler } from "express";

export interface IServiceResolver {
    resolve(serviceName: string): RequestHandler;
}