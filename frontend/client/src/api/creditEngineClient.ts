/**
 * Client communication layer
 * for WAD credit reporting backend.
 */


import {
    CreditApplicantInput,
    CreditReportResponse
} from "../types/creditReport";


const CREDIT_ENGINE_ENDPOINT =
    "/api/credit-report";



export async function requestCreditReport(
    input: CreditApplicantInput
): Promise<CreditReportResponse> {


    const response =
        await fetch(
            CREDIT_ENGINE_ENDPOINT,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(input)
            }
        );


    if (!response.ok) {

        throw new Error(
            "Credit report generation failed."
        );
    }


    return response.json();
}
