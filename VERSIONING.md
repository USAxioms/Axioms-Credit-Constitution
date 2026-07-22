# Axioms-Credit-Constitution — VERSIONING

The Axioms-Credit-Constitution uses a constitutional versioning model designed
to preserve transparency, auditability, and deterministic scoring across all
implementations. Every change to the scoring engine, ruleset, or configs must
be versioned according to the guidelines below.

---

# Version Categories

AXIOMS uses three independent version tracks:

### 1. Engine Version — `E.x.x.x`
Represents changes to:
- Scoring math
- Factor engine logic
- Orchestrator behavior
- Environment loader
- API or backend architecture

Engine versions affect how scores are computed.

### 2. Ruleset Version — `R.x.x.x`
Represents changes to:
- Factor definitions
- Factor weights
- Constitutional scoring principles
- Transparency guarantees
- Published scoring methodology

Ruleset versions define the “Credit Constitution” itself.

### 3. Config Version — `C.x.x.x`
Represents changes to:
- JSON factor configs
- Thresholds
- Decay curves
- Penalty parameters
- Utilization bands

Config versions adjust factor behavior without changing the constitution.

---

# Versioning Philosophy

### Determinism
Every version must produce deterministic results.  
A score computed under `R1.0.0` must always match the same score computed under `R1.0.0`.

### Transparency
All version changes must be documented in `CHANGELOG.md`.  
No silent changes are permitted.

### Independence
Engine, ruleset, and config versions evolve independently.  
A change in one does not require a change in the others.

### Backward Compatibility
Ruleset versions may break backward compatibility.  
Engine versions should avoid breaking changes unless necessary.  
Config versions should remain backward compatible unless thresholds change.

---

# Version Numbering

AXIOMS uses a four-part semantic structure:
