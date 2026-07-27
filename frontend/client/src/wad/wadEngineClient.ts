/**
 * WAD Engine Client
 *
 * Sends integer-native pulse sequences
 * to the backend execution engine.
 */


import {
    WadContextState
} from "./contextWindowHandler";



export async function executeWadPulse(
    pulseSequence: number[]
): Promise<WadContextState> {


    const response =
        await fetch(
            "/api/wad/execute",
            {

                method: "POST",

                headers: {

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
            "WAD Execution Failed."
        );

    }



    return response.json();

}
