/**
 * WAD Pulse Ledger Commitment
 *
 * Activated only after user authorization.
 */


export async function commitPulse(
    pulseSequence:number[]
) {


    const response =
        await fetch(
            "/api/wad-credit/ledger",
            {

                method:"POST",

                headers:{

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        pulseSequence
                    )

            }
        );


    if (!response.ok) {

        throw new Error(
            "Ledger commitment failed."
        );

    }


    return response.json();

}
