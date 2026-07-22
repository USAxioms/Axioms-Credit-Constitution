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
