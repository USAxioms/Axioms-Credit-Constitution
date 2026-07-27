/**
 * Credit Reporting Pulse Schema
 *
 * Defines the deterministic interpretation
 * of credit reporting pulse integers.
 *
 * WAD Layer:
 * - Integer-native state representation
 * - Version-controlled schema
 * - Deterministic interpretation
 */

export const CREDIT_PULSE_SCHEMA_VERSION = 1;


export interface CreditPulseSchema {

    version: number;

    fields: CreditPulseField[];

}


export interface CreditPulseField {

    index: number;

    name: string;

    description: string;

    minimum: number;

    maximum: number;

}


export const CREDIT_REPORTING_SCHEMA:
    CreditPulseSchema = {


    version:
        CREDIT_PULSE_SCHEMA_VERSION,


    fields: [

        {
            index: 0,
            name: "schemaVersion",
            description:
                "Credit reporting pulse schema version",
            minimum: 1,
            maximum: 999
        },

        {
            index: 1,
            name: "paymentHistoryScore",
            description:
                "Historical payment performance factor",
            minimum: 0,
            maximum: 100
        },

        {
            index: 2,
            name: "creditUtilizationScore",
            description:
                "Credit utilization factor",
            minimum: 0,
            maximum: 100
        },

        {
            index: 3,
            name: "debtObligationScore",
            description:
                "Debt management factor",
            minimum: 0,
            maximum: 100
        },

        {
            index: 4,
            name: "creditAgeScore",
            description:
                "Length and stability of credit history",
            minimum: 0,
            maximum: 100
        },

        {
            index: 5,
            name: "verificationScore",
            description:
                "Data verification confidence factor",
            minimum: 0,
            maximum: 100
        }
    ]
};
