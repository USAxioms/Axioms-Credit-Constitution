# Axioms-Credit-Constitution — ARCHITECTURE OVERVIEW

This document provides a high‑level overview of the architecture that powers
the Axioms-Credit-Constitution scoring engine. It explains how the system is
structured, how components interact, and how transparency is preserved across
the entire scoring pipeline.

---

# Architectural Goals

- Deterministic scoring
- Transparent ruleset definition
- Configurable factor behavior
- Contract‑agnostic blockchain integration
- Enterprise‑ready API interface
- Modular, auditable components

---

# System Components

The architecture consists of the following major components:

1. **Ruleset Manifest**
2. **Factor Configurations**
3. **Factor Engines**
4. **Orchestrator**
5. **Environment Loader**
6. **Contract Wrapper (Optional)**
7. **API Layer**
8. **Frontend/Mobile Client Wrapper**

Each component is independent and versioned.

---

# 1. Ruleset Manifest

The ruleset manifest defines:

- Ruleset version (R.x.x.x)
- Factor weights (WAD)
- Paths to factor configs
- Constitutional scoring principles

It acts as the “constitution” of the scoring system.

Example:
ruleset/manifest.json
---

# 2. Factor Configurations

Each factor has a dedicated JSON config file stored in:
ruleset/configs/
Configs define:

- Thresholds
- Bands
- Decay curves
- Penalty values
- Explanations

Config versions follow `C.x.x.x`.

---

# 3. Factor Engines

Each factor has its own engine:

- PaymentHistoryEngine
- UtilizationEngine
- HistoryLengthEngine
- CreditMixEngine
- PenaltyEngine

Responsibilities:

- Load config
- Process inputs
- Compute component score (0–100)
- Produce explanation
- Flag derogatory events

Factor engines are deterministic and isolated.

---

# 4. Orchestrator

The orchestrator coordinates the scoring process:

- Loads manifest + configs
- Calls each factor engine
- Applies WAD weights
- Computes composite score
- Produces final scoring report

It is the central scoring controller.

---

# 5. Environment Loader

The environment loader resolves file paths:

- Manifest path
- Config directory
- Ruleset version
- Engine version
- Config version

It ensures the correct versioned files are loaded.

---

# 6. Contract Wrapper (Optional)

AXIOMS is blockchain‑optional.

If used on‑chain, the contract wrapper provides:

- `setCompositeScore`
- `setComponentScore`
- `setCreditEvent`

The wrapper is contract‑agnostic and can connect to any compatible smart contract.

---

# 7. API Layer

Primary enterprise integration point.

Endpoint:
POST /score
Responsibilities:

- Validate input
- Convert bigint parameters
- Call orchestrator
- Return composite + component scores
- (Optional) Write to contract

The API is stateless and deterministic.

---

# 8. Frontend/Mobile Client Wrapper

A lightweight client for:

- Web apps
- Mobile apps
- Dashboards

Provides:

- Simple scoring request interface
- Formatted scoring report output

This wrapper is optional but useful for B2B integrations.

---

# Data Flow Overview
User Input ↓ API Layer ↓ Environment Loader ↓ Ruleset Manifest + Configs ↓ Factor Engines ↓ Orchestrator ↓ Composite Score + Components ↓ (Optional) Contract Wrapper ↓ Output Report
