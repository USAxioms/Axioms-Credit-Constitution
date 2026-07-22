# Axioms-Credit-Constitution — RULESET SPECIFICATION

The Axioms Credit Constitution defines the transparent, deterministic ruleset
used to compute credit scores. This document describes the constitutional
principles, factor definitions, weights, and scoring methodology for the
current ruleset version.

---

# Ruleset Version
**R1.0.0 — Initial Constitutional Ruleset**

This is the first fully transparent scoring ruleset ever published.

---

# Constitutional Principles

### 1. Transparency
All scoring logic must be publicly documented, auditable, and versioned.

### 2. Determinism
Given the same inputs and the same ruleset version, AXIOMS must always produce
the same score.

### 3. Factor Independence
Each factor must compute its score independently before being weighted into the
composite score.

### 4. Explicit Weights
Weights must be published and cannot be hidden or implicit.

### 5. Configurability
Factor behavior must be defined in JSON configs that can be updated without
changing constitutional principles.

### 6. Verifiability
Scores may be written on‑chain for public verification, but blockchain use is
optional.

---

# Factor Overview

AXIOMS uses five constitutional scoring factors:

1. **Payment History**
2. **Utilization**
3. **History Length**
4. **Credit Mix**
5. **Penalty**

Each factor produces:
- A component score (0–100)
- A max possible score (100)
- A derogatory flag (true/false)
- An explanation string

---

# Factor Weights (R1.0.0)

| Factor            | Weight (WAD) |
|------------------|--------------|
| Payment History  | 0.35         |
| Utilization      | 0.30         |
| History Length   | 0.15         |
| Credit Mix       | 0.10         |
| Penalty          | 0.10         |

Composite Score Formula:

Composite = Σ (FactorScore_i * Weight_i)
All math uses WAD precision (1e18).

---

# Factor Definitions

## 1. Payment History
Evaluates the user’s record of on‑time vs late payments.

Inputs:
- Total payments
- Late payments
- Severe delinquencies

Config:
- payment_history.json

Output:
- Score decreases with late payments
- Severe delinquencies trigger derogatory flag

---

## 2. Utilization
Measures how much credit the user is using relative to their limit.

Inputs:
- Total credit limit
- Current balance

Config:
- utilization.json

Output:
- Score decreases as utilization increases
- High utilization may trigger derogatory flag

---

## 3. History Length
Evaluates how long the user has maintained credit accounts.

Inputs:
- Age of oldest account
- Average account age

Config:
- history_length.json

Output:
- Longer history increases score
- Very short history may reduce score

---

## 4. Credit Mix
Evaluates diversity of credit types.

Inputs:
- Revolving accounts
- Installment accounts
- Open accounts

Config:
- credit_mix.json

Output:
- More diverse credit mix increases score

---

## 5. Penalty
Applies constitutional penalties for derogatory events.

Inputs:
- Bankruptcies
- Charge-offs
- Collections
- Hard inquiries

Config:
- penalty.json

Output:
- Penalties reduce score
- Severe events trigger derogatory flag

---

# Config Files

Each factor uses a JSON config file stored in:
ruleset/configs/
Config files define:
- Thresholds
- Bands
- Decay curves
- Penalty values
- Explanations

Config Version:
**C1.0.0**

---

# Deterministic Scoring Flow

1. Load ruleset manifest  
2. Load factor configs  
3. Compute each factor independently  
4. Apply WAD weights  
5. Sum weighted factors  
6. Produce composite score  
7. Optionally write to contract  

All steps are deterministic and auditable.

---

# Constitutional Guarantees

- Scores are reproducible  
- Rules are published  
- Weights are explicit  
- Versions are documented  
- No hidden logic  
- No proprietary black boxes  

This is the foundation of transparent scoring.
