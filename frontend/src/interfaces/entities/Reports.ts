export interface Reports {
    id?: string;
    userId: string;
    reportType: ReportTypes;
    reportedBy: string;
    status?: ReportActions;
    description: string;
    evidence?: string;
    createdAt?: string;
}

export interface ReportForm {
    userId: string;
    reportType: ReportTypes;
    reportedBy: string;
    status?: ReportActions;
    description: string;
    evidence?: string | File;
}

export type ReportTypes = 'Event Fraud' | 'Abuse' | 'Spam' | 'Harassment' | 'Fake Profile';
export type ReportActions = 'Pending' | 'Reviewed' | 'Action Taken' | 'Dismissed'