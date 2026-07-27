import {
    useState
} from "react";


import {
    CreditApplicantInput
} from "../types/creditReport";


interface Props {

    onGenerate:
        (input: CreditApplicantInput) => void;

}



export default function CreditApplicationForm(
    {
        onGenerate
    }: Props
) {


    const [input,setInput] =
        useState<CreditApplicantInput>({

            applicantId: "",

            paymentHistory: 0,

            creditUtilization: 0,

            debtObligation: 0,

            creditAge: 0,

            verificationScore: 0

        });



    function update(
        field: keyof CreditApplicantInput,
        value: string
    ) {

        setInput({

            ...input,

            [field]:
                field === "applicantId"
                    ? value
                    : Number(value)

        });

    }



    return (

        <form
            onSubmit={
                event => {

                    event.preventDefault();

                    onGenerate(input);

                }
            }
        >

            <input
                placeholder="Applicant ID"
                onChange={
                    e =>
                    update(
                        "applicantId",
                        e.target.value
                    )
                }
            />


            <input
                placeholder="Payment History"
                onChange={
                    e =>
                    update(
                        "paymentHistory",
                        e.target.value
                    )
                }
            />


            <input
                placeholder="Credit Utilization"
                onChange={
                    e =>
                    update(
                        "creditUtilization",
                        e.target.value
                    )
                }
            />


            <input
                placeholder="Debt Obligation"
                onChange={
                    e =>
                    update(
                        "debtObligation",
                        e.target.value
                    )
                }
            />


            <input
                placeholder="Credit Age"
                onChange={
                    e =>
                    update(
                        "creditAge",
                        e.target.value
                    )
                }
            />


            <input
                placeholder="Verification Score"
                onChange={
                    e =>
                    update(
                        "verificationScore",
                        e.target.value
                    )
                }
            />


            <button type="submit">
                Generate Credit Report
            </button>

        </form>
    );
}
