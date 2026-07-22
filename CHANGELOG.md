# Axioms-Credit-Constitution — CHANGELOG

All notable changes to the Axioms-Credit-Constitution scoring engine,
ruleset, and architecture are documented in this file.

This project follows a constitutional versioning model:
- Engine Versions (E.x.x.x)
- Ruleset Versions (R.x.x.x)
- Config Versions (C.x.x.x)

Each version is fully transparent and auditable.

---

## [R1.0.0] — Initial Constitutional Ruleset
### Added
- Published the first complete version of the Axioms Credit Constitution.
- Introduced five core scoring factors:
  - Payment History
  - Utilization
  - History Length
  - Credit Mix
  - Penalty
- Added deterministic WAD-based scoring math.
- Added JSON-based factor configuration system.
- Added versioned ruleset manifest.

### Notes
This marks the first fully transparent scoring ruleset ever published.

---

## [E1.0.0] — Engine Initialization
### Added
- Implemented deterministic scoring engine.
- Added orchestrator for composite + component scoring.
- Added environment loader for ruleset + config paths.
- Added factor engine architecture.
- Added penalty engine for derogatory events.

### Notes
Engine is fully functional and ready for B2B licensing.

---

## [C1.0.0] — Default Config Set
### Added
- Published default factor configs:
  - payment_history.json
  - utilization.json
  - history_length.json
  - credit_mix.json
  - penalty.json
- Added decay.json for time-based scoring adjustments.

### Notes
Config set is transparent and auditable.

---

## [E1.1.0] — Contract Wrapper Integration (Optional)
### Added
- Added contract.ts wrapper for writing scores to any compatible smart contract.
- Added support for:
  - setCompositeScore
  - setComponentScore
  - setCreditEvent

### Notes
Blockchain integration is optional and contract-agnostic.

---

## [E1.2.0] — API Endpoint
### Added
- Added POST /score endpoint.
- Added input validation.
- Added bigint param conversion.
- Added formatted JSON scoring output.

### Notes
This endpoint is the primary integration point for enterprise clients.

---

## [F1.0.0] — Frontend Client Wrapper
### Added
- Added scoreClient.ts for frontend/mobile integration.
- Added formatted scoring report output.

### Notes
This wrapper simplifies integration for UI and mobile apps.

---

## Versioning Philosophy
- Ruleset versions change when scoring logic changes.
- Engine versions change when architecture or math changes.
- Config versions change when factor parameters change.

All changes must be documented here to preserve transparency.
