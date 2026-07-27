import {
    CreditContextState
} from "../context/creditContext";


interface Props {

    context:
        CreditContextState;

}



export default function CreditReport(
    {
        context
    }: Props
) {


    return (

        <section>

            <h2>
                WAD Credit Report
            </h2>


            <p>
                Schema Version:
                {context.result.activeVersion}
            </p>


            <p>
                Computed Score:
                {context.result.computedScore}
            </p>


            <p>
                Pulse:

                {
                    JSON.stringify(
                        context.pulseSequence
                    )
                }

            </p>


        </section>

    );

}
