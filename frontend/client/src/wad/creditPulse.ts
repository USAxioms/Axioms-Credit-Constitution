/**
 * WAD Credit Reporting Pulse
 *
 * Frontend pulse construction layer.
 *
 * Index 0:
 *     Schema Version Header
 *
 * Index 1+:
 *     Credit Reporting Metrics
 */


export const CREDIT_SCHEMA_VERSION = 1;


export interface CreditMetrics {

    paymentHistory: number;

    creditUtilization: number;

    debtObligation: number;

    creditAge: number;

    verificationScore: number;

}



function validateInteger(
    value: number
): number {

    if (
        !Number.isInteger(value) ||
        value < 0
    ) {

        throw new Error(
            "WAD Error: Invalid integer state."
        );

    }

    return value;
}



export function createCreditPulse(
    metrics: CreditMetrics
): number[] {


    return [

        CREDIT_SCHEMA_VERSION,

        validateInteger(
            metrics.paymentHistory
        ),

        validateInteger(
            metrics.creditUtilization
        ),

        validateInteger(
            metrics.debtObligation
        ),

        validateInteger(
            metrics.creditAge
        ),

        validateInteger(
            metrics.verificationScore
        )

    ];

}
