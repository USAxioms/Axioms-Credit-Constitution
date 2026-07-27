/**
 * Credit Reporting Frontend Types
 *
 * Defines the data contracts between
 * the user interface and the WAD credit engine.
 */


export interface CreditApplicantInput {

    applicantId: string;

    paymentHistory: number;

    creditUtilization: number;

    debtObligation: number;

    creditAge: number;

    verificationScore: number;
}



export interface CreditReportResponse {

    reportId: string;

    schemaVersion: number;

    computedScore: number;

    metrics: Record<string, number>;

    pulseSequence: number[];

    ledgerStatus:
        | "LOCAL"
        | "COMMITTED";
}
