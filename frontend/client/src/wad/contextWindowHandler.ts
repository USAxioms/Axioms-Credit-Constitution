/**
 * WAD Context Window Handler
 *
 * Receives deterministic engine results
 * and prepares the temporary interface state.
 *
 * This is ephemeral display memory.
 * It does not commit to the ledger.
 */


export interface WadContextState {

    activeVersion: number;

    payloadMetrics: number[];

    computedScore: number;

    ledgerCommitted: boolean;

}



export function createContextState(
    result: {
        activeVersion: number;
        payloadMetrics: number[];
        computedScore: number;
    }
): WadContextState {


    return {

        activeVersion:
            result.activeVersion,


        payloadMetrics:
            result.payloadMetrics,


        computedScore:
            result.computedScore,


        ledgerCommitted:
            false

    };
}
