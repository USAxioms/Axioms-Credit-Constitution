/**
 * WAD Ledger Commit Handler
 *
 * Activated only after user authorization.
 *
 * Sends validated pulse state
 * for blockchain persistence.
 */


export interface LedgerPulseCommit {

    pulseSequence: number[];

    reportId: string;

}



export interface LedgerCommitResult {

    transactionId: string;

    status:
        | "CONFIRMED"
        | "PENDING";

}



export async function commitPulseToLedger(
    request: LedgerPulseCommit
): Promise<LedgerCommitResult> {


    const response =
        await fetch(
            "/api/ledger/pulse",
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
            "WAD Ledger Commitment Failed."
        );

    }



    return response.json();

}
