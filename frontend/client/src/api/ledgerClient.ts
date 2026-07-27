/**
 * Optional ledger commitment layer.
 *
 * Activated only after user authorization.
 */


export interface LedgerCommitRequest {

    reportId: string;

    pulseSequence: number[];

}



export interface LedgerCommitResponse {

    transactionId: string;

    status:
        | "PENDING"
        | "CONFIRMED";
}



export async function commitCreditPulse(
    request: LedgerCommitRequest
): Promise<LedgerCommitResponse> {


    const response =
        await fetch(
            "/api/ledger/commit",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(request)
            }
        );


    if (!response.ok) {

        throw new Error(
            "Ledger commitment failed."
        );
    }


    return response.json();
}
