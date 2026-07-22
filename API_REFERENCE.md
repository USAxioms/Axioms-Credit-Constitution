`markdown

API Reference (Simplified)

POST /score
Compute a credit score.

Request
`json
{
  "requestId": "string",
  "subject": {
    "address": "0x...",
    "identifier": "string"
  },
  "rulesetVersion": "R1.0.0",
  "configVersion": "C1.0.0",
  "engineVersion": "E1.2.0",
  "inputs": {
    "paymentHistory": {
      "totalPayments": 120,
      "latePayments": 2
    },
    "utilization": {
      "totalLimit": "100000",
      "currentBalance": "12000"
    },
    "historyLength": {
      "oldestAccountYears": 6,
      "averageAccountYears": 3.2
    },
    "creditMix": {
      "revolving": 2,
      "installment": 1,
      "openAccounts": 3
    },
    "penaltyEvents": [
      { "type": "collection", "timestamp": 1672531200 }
    ]
  }
}
`

Response
`json
{
  "requestId": "string",
  "compositeScore": 78.45,
  "componentScores": {
    "paymentHistory": 85,
    "utilization": 72,
    "historyLength": 80,
    "creditMix": 70,
    "penalty": 60
  },
  "derogatory": false,
  "explanations": {
    "paymentHistory": "2 late payments",
    "utilization": "12% utilization"
  }
}
`

---

GET /score/{requestId}
Retrieve a previously computed score.

Response
Same as POST /score.

---

POST /ruleset/validate
Validate a ruleset + configs.

Request
`json
{
  "manifest": {},
  "configs": {}
}
`

Response
`json
{
  "valid": true,
  "errors": []
}
`

---

GET /ruleset/{version}
Return ruleset metadata.

Response
`json
{
  "version": "R1.0.0",
  "weights": {
    "paymentHistory": "0.35",
    "utilization": "0.30"
  },
  "configVersion": "C1.0.0"
}
`

---

POST /contract/write (Optional)
Write scores to a compatible smart contract.

Request
`json
{
  "requestId": "string",
  "contractAddress": "0x...",
  "compositeScore": 78.45,
  "componentScores": [85,72,80,70,60],
  "subjectAddress": "0x..."
}
`

Response
`json
{
  "requestId": "string",
  "txHash": "0x..."
}
`

---

GET /health
Simple health check.

Response
`json
{ "status": "ok" }
`
`

If you want the INTEGRATION_GUIDE.md next, just say Next.
