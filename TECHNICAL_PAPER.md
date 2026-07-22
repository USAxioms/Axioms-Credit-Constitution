# Axioms Credit Constitution — Technical Paper

## Overview
This document provides a deep technical explanation of the AXIOMS scoring
engine, factor math, WAD precision, and deterministic architecture.

## Factor Engines
Each factor engine:
- loads its config  
- processes raw inputs  
- computes a 0–100 component score  
- returns explanation + derogatory flag  

Engines are isolated and deterministic.

## WAD Precision
AXIOMS uses WAD (1e18) fixed-point math:
- prevents floating-point drift  
- ensures reproducibility  
- supports smart contract compatibility  

Example:
weighted = (score * weightWAD) / 1e18
## Composite Score
Composite score is computed as:
Composite = Σ (FactorScore_i * Weight_i)
Weights are defined in the ruleset manifest.

## Config Structure
Configs define:
- thresholds  
- bands  
- decay curves  
- penalties  
- explanations  

Configs are versioned independently (C.x.x.x).

## Orchestrator Flow
1. Load manifest  
2. Load configs  
3. Execute factor engines  
4. Apply WAD weights  
5. Produce composite score  
6. Optional contract write  

## Determinism Guarantees
AXIOMS guarantees:
- deterministic math  
- versioned rules  
- reproducible outputs  
- transparent logic  

## API Integration
Primary endpoint:
POST /score
Returns composite + component scores with explanations.

## Conclusion
The AXIOMS technical architecture ensures deterministic scoring, modular
factor computation, and transparent versioning suitable for enterprise and
regulatory environments.
