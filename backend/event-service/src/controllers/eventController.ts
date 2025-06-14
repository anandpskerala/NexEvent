import { Request, Response } from "express";
import { IEvent } from "../shared/types/IEvent";
import { EventService } from "../services/eventService";

export class EventController {
    constructor(private eventService: EventService) {}

    public createEvent = async (req: Request, res: Response): Promise<void> => {
        const { title, description, eventType, category, image, tags, location, eventFormat, startDate, endDate, startTime, endTime, userId } = req.body;
        const event: IEvent = {
            title,
            description,
            eventFormat,
            eventType,
            category,
            image,
            tags,
            location,
            startDate,
            endDate,
            startTime,
            endTime,
            userId
        };

        const result = await this.eventService.createEvent(event);
        res.status(result.status).json({message: result.message, event: result.event});
    }
    
    
    public createTicket = async (req: Request, res: Response): Promise<void> => {
        const { id, currency, entryType, showQuantity, refunds, tickets } = req.body;
        const result = await this.eventService.createTicket(id, currency, entryType, showQuantity, refunds, tickets);
        res.status(result.status).json({message: result.message});
    }

    public getEvent = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const result = await this.eventService.getEvent(id);
        res.status(result.status).json({message: result.message, event: result.event});
    }

    public getAllEvents = async (req: Request, res: Response): Promise<void> => {
        const { search = "", page = 1, limit = 10, category = "" } = req.query;
        const result = await this.eventService.getAllEvents(search as string, page as number, limit as number, category as string);
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            events: result.events
        })
    }

    public getNearByEvents = async (req: Request, res: Response): Promise<void> => {
        const { lat = 0, lng = 0 } = req.query;
        const result = await this.eventService.getNearbyEvents(lat as number, lng as number);
        res.status(result.status).json({message: result.message, events: result.events});
    }

    public getEvents = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'];
        const { search = "", page = 1, limit = 10} = req.query;
        const result = await this.eventService.getEvents(userId as string, search as string, page as number, limit as number);
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            events: result.events
        })
    }

    public editEvent = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { title, description, eventType, category, image, tags, location, eventFormat, startDate, endDate, startTime, endTime } = req.body;
        const event:IEvent = {
            id,
            title,
            description,
            eventFormat,
            eventType,
            category,
            image,
            tags,
            location,
            startDate,
            endDate,
            startTime,
            endTime,

        };
        const result = await this.eventService.updateEvent(event);
        res.status(result.status).json({message: result.message, event: result.event})
    }

    public editTicket = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const { currency, entryType, showQuantity, refunds, tickets } = req.body;
        const result = await this.eventService.createTicket(id, currency, entryType, showQuantity, refunds, tickets, true);
        res.status(result.status).json({message: result.message});
    }

    public checkSaved = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.headers['x-user-id'];
        const result = await this.eventService.isSavedEvent(userId as string, id);
        res.status(result.status).json({message: result.message, saved: result.saved});
    }

    public saveEvent = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { eventId } = req.body;
        const result = await this.eventService.saveEvent(id, eventId);
        res.status(result.status).json({message: result.message, saved: result.saved});
    }

    public removeSaved = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const userId = req.headers['x-user-id'] as string;
        const result = await this.eventService.removeSavedEvent(id, userId);
        res.status(result.status).json({message: result.message, saved: result.saved});
    }

    public getAllSaved = async (req: Request, res: Response): Promise<void> => {
        const userId = req.headers['x-user-id'] as string;
        const { page = 1, limit = 10 } = req.query;
        const result = await this.eventService.getAllSaved(userId, Number(page), Number(limit));
        res.status(result.status).json({
            message: result.message,
            total: result.total,
            page: result.page,
            pages: result.pages,
            events: result.events
        })
    }
}