/**
 * Represents the credit report state
 * before optional ledger commitment.
 */


export interface CreditReportState {


    reportId: string;


    schemaVersion: number;


    metrics:
        Record<string, number>;


    computedScore: number;


    status:
        | "GENERATED"
        | "USER_REVIEWED"
        | "AUTHORIZED"
        | "COMMITTED";


    timestamp: number;

}



export function createCreditReportState(
    schemaVersion: number,
    metrics: Record<string, number>,
    computedScore: number
): CreditReportState {


    return {

        reportId:
            createReportId(),


        schemaVersion,


        metrics,


        computedScore,


        status:
            "GENERATED",


        timestamp:
            Date.now()
    };

}



function createReportId(): string {

    return (
        "CR-" +
        Date.now()
            .toString(16)
    );
}
