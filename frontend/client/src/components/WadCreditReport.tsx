/**
 * WAD Credit Report Display
 *
 * Displays deterministic engine output
 * inside the interface context window.
 */


import {
    WadContextState
} from "../wad/contextWindowHandler";



interface Props {

    state:
        WadContextState;

}



export default function WadCreditReport(
    {
        state
    }: Props
) {


    return (

        <section>


            <h2>
                WAD Credit Report
            </h2>


            <p>
                Schema Version:
                {state.activeVersion}
            </p>


            <p>
                Computed Score:
                {state.computedScore}
            </p>


            <h3>
                Pulse Metrics
            </h3>


            {
                state.payloadMetrics.map(
                    (
                        metric,
                        index
                    ) => (

                        <p key={index}>

                            Index {index + 1}:
                            {metric}

                        </p>

                    )
                )
            }


        </section>

    );

}
