import { Model } from "mongoose";
import { AllIReports, IReport } from "../../shared/types/IReport";
import { IReportRepository } from "../interfaces/IReportRepository";
import reportModel from "../../models/reportModel";

export class ReportRepository implements IReportRepository {
    private readonly model: Model<IReport>;

    constructor() {
        this.model = reportModel;
    }

    async createReport(data: Partial<IReport>): Promise<IReport> {
        const doc = await this.model.create(data);
        return doc.toJSON();
    }

    async getReport(id: string): Promise<IReport | undefined> {
        const doc = await this.model.findById(id);
        return doc?.toJSON();
    }

    async updateReport(id: string, data: Partial<IReport>): Promise<IReport | undefined> {
        const doc = await this.model.findByIdAndUpdate(id, {$set: data}, {new: true});
        return doc?.toJSON();
    }

    async getReports(offset: number, limit: number): Promise<AllIReports> {
        const [total, docs] = await Promise.all([
            this.model.countDocuments(),
            this.model.find({}).sort({createdAt: -1}).skip(offset).limit(limit)
        ]);
        const items = docs.map(doc => doc.toJSON());

        return {
            items,
            total
        }
    }

    async findDuplicate(userId: string, reportedBy: string): Promise<boolean> {
        const doc = await this.model.findOne({userId, reportedBy});
        return !!doc;
    }

    async deleteRequest(id: string): Promise<void> {
        await this.model.deleteOne({_id: id});
    }
}