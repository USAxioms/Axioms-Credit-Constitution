import { useState } from "react";
import { CURRENT_SCHEMA_VERSION } from "../engine/wadComplianceEngine";

interface CreditApplicantInput {
    paymentHistory: number;
    creditUtilization: number;
    debtObligation: number;
    creditAge: number;
    verificationScore: number;
}

interface Props {
    onGenerate: (pulseSequence: number[]) => void;
}

export default function CreditApplicationForm({ onGenerate }: Props) {
    const [input, setInput] = useState<CreditApplicantInput>({
        paymentHistory: 0,
        creditUtilization: 0,
        debtObligation: 0,
        creditAge: 0,
        verificationScore: 0
    });

    function update(field: keyof CreditApplicantInput, value: string) {
        setInput({
            ...input,
            // Enforce integer-native parsing to prevent floating-point drift
            [field]: parseInt(value, 10) || 0
        });
    }

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                
                // Construct the integer-native pulse sequence with Index 0 schema version header
                const pulseSequence = [
                    CURRENT_SCHEMA_VERSION,
                    input.paymentHistory,
                    input.creditUtilization,
                    input.debtObligation,
                    input.creditAge,
                    input.verificationScore
                ];

                onGenerate(pulseSequence);
            }}
        >
            <input
                type="number"
                placeholder="Payment History"
                onChange={e => update("paymentHistory", e.target.value)}
            />

            <input
                type="number"
                placeholder="Credit Utilization"
                onChange={e => update("creditUtilization", e.target.value)}
            />

            <input
                type="number"
                placeholder="Debt Obligation"
                onChange={e => update("debtObligation", e.target.value)}
            />

            <input
                type="number"
                placeholder="Credit Age"
                onChange={e => update("creditAge", e.target.value)}
            />

            <input
                type="number"
                placeholder="Verification Score"
                onChange={e => update("verificationScore", e.target.value)}
            />

            <button type="submit">
                Generate Credit Report
            </button>
        </form>
    );
}
