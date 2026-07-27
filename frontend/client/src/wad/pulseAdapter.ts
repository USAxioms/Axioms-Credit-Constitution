/**
 * WAD Pulse Adapter
 *
 * Converts frontend credit inputs into
 * integer-native WAD pulse sequences.
 *
 * Index 0:
 *     Schema Version Header
 *
 * Index 1+:
 *     Credit Metrics
 */


import {
    CURRENT_SCHEMA_VERSION
} from "../engine/wadComplianceEngine";


export interface CreditMetrics {

    paymentHistory: number;

    creditUtilization: number;

    debtObligation: number;

    creditAge: number;

    verificationScore: number;

}



function enforceInteger(
    value: number
): number {

    if (
        !Number.isInteger(value) ||
        value < 0
    ) {

        throw new Error(
            "WAD Error: Non-integer or negative metric."
        );
    }


    return value;
}



export function createCreditPulse(
    metrics: CreditMetrics
): number[] {


    return [

        CURRENT_SCHEMA_VERSION,

        enforceInteger(
            metrics.paymentHistory
        ),

        enforceInteger(
            metrics.creditUtilization
        ),

        enforceInteger(
            metrics.debtObligation
        ),

        enforceInteger(
            metrics.creditAge
        ),

        enforceInteger(
            metrics.verificationScore
        )

    ];
}
