import {
    CreditReportState
} from "../state/creditReportState";


export interface CreditAOIResult {


    accepted: boolean;


    nextState:
        CreditReportState;


    reason: string;

}



export interface CreditAOIInterpreter {


    evaluate(
        report:
            CreditReportState
    ):
        CreditAOIResult;

}
