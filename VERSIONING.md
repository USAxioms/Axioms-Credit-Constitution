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
MAJOR.MINOR.PATCH.REVISION
### MAJOR
Fundamental changes to scoring philosophy or architecture.

### MINOR
New features, factor additions, or structural improvements.

### PATCH
Bug fixes, clarifications, or minor adjustments.

### REVISION
Internal updates that do not affect scoring output.

---

# Examples

### Engine Version Example
`E1.2.0`  
- Added API endpoint  
- No change to scoring math  

### Ruleset Version Example
`R2.0.0`  
- Introduced new factor  
- Updated constitutional scoring principles  

### Config Version Example
`C1.1.0`  
- Adjusted utilization thresholds  
- No change to factor weights  

---

# Version Disclosure Requirement

Any organization using AXIOMS to compute scores **must disclose**:

- The Engine Version  
- The Ruleset Version  
- The Config Version  

This is required to maintain transparency and trust.

---

# Summary

The constitutional versioning model ensures:

- Deterministic scoring  
- Transparent updates  
- Auditable changes  
- Enterprise reliability  
- Public trust  

All changes must be documented and versioned according to this standard.
