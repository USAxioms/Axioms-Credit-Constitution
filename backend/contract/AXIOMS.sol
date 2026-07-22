// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
 * AXIOMS CREDIT ENGINE — ON‑CHAIN LEDGER CONTRACT
 *
 * Stores:
 *  - ruleset hash
 *  - composite score (WAD)
 *  - component scores (WAD)
 *  - raw credit event parameters (16 WAD values)
 *
 * Performs NO computation.
 * All scoring is done off‑chain in the constitutional environment.
 */

contract AXIOMS {
    // Active ruleset hash
    string public rulesetHash;

    // Composite score per user (WAD)
    mapping(string => uint256) private compositeScore;

    // Component scores per user (4 factors, WAD)
    mapping(string => mapping(uint8 => uint256)) private componentScores;

    // Raw credit event parameters (16 WAD values)
    mapping(string => uint256[16]) private creditEvents;

    /* ------------------------------------------------------------ */
    /*                         RULESET HASH                         */
    /* ------------------------------------------------------------ */

    function setRulesetHash(string memory hash) external {
        rulesetHash = hash;
    }

    /* ------------------------------------------------------------ */
    /*                       COMPOSITE SCORE                        */
    /* ------------------------------------------------------------ */

    function getCompositeScore(string memory user)
        external
        view
        returns (uint256)
    {
        return compositeScore[user];
    }

    function setCompositeScore(string memory user, uint256 scoreWad)
        external
    {
        compositeScore[user] = scoreWad;
    }

    /* ------------------------------------------------------------ */
    /*                       COMPONENT SCORES                       */
    /* ------------------------------------------------------------ */

    function getComponentScore(string memory user, uint8 factorId)
        external
        view
        returns (uint256)
    {
        return componentScores[user][factorId];
    }

    function setComponentScore(
        string memory user,
        uint8 factorId,
        uint256 scoreWad
    ) external {
        componentScores[user][factorId] = scoreWad;
    }

    /* ------------------------------------------------------------ */
    /*                     CREDIT EVENT STORAGE                     */
    /* ------------------------------------------------------------ */

    function getCreditEvent(string memory user)
        external
        view
        returns (uint256[16] memory)
    {
        return creditEvents[user];
    }

    function setCreditEvent(string memory user, uint256[] memory params)
        external
    {
        require(params.length == 16, "Must supply exactly 16 WAD params");

        for (uint256 i = 0; i < 16; i++) {
            creditEvents[user][i] = params[i];
        }
    }
}
