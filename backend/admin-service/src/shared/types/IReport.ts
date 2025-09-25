export interface IReport {
    id?: string;
    userId: string;
    reportType: ReportTypes;
    reportedBy: string;
    status?: ReportActions;
    description: string;
    evidence?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AllIReports {
    items: IReport[],
    total: number
}

export type ReportTypes = 'Event Fraud' | 'Abuse' | 'Spam' | 'Harassment' | 'Fake Profile';
export type ReportActions = 'Pending' | 'Reviewed' | 'Action Taken' | 'Dismissed';