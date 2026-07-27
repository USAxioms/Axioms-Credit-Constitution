import {
    CREDIT_REPORTING_SCHEMA
} from "../schema/creditPulseSchema";


export interface CreditPulseState {

    schemaVersion: number;

    metrics:
        Record<string, number>;

}


export function interpretCreditPulse(
    pulse: number[]
): CreditPulseState {


    const schema =
        CREDIT_REPORTING_SCHEMA;


    if (
        pulse.length <
        schema.fields.length
    ) {

        throw new Error(
            "Credit Pulse Error: Invalid pulse length."
        );
    }


    const metrics:
        Record<string, number> = {};


    for (
        const field of schema.fields
    ) {

        const value =
            pulse[field.index];


        if (
            value < field.minimum ||
            value > field.maximum
        ) {

            throw new Error(
                `Credit Pulse Error: ${field.name} outside bounds.`
            );
        }


        metrics[field.name] =
            value;
    }


    return {

        schemaVersion:
            pulse[0],

        metrics
    };
}
