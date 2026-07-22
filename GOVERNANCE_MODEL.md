# Axioms Credit Constitution — Governance Model

## Purpose
This governance model defines how AXIOMS rulesets, configs, and engine
versions evolve while maintaining transparency and public trust.

## Governance Principles
- Transparency  
- Determinism  
- Auditability  
- Public documentation  
- Version independence  

## Version Types
- **Engine Version (E.x.x.x)** — scoring math + architecture  
- **Ruleset Version (R.x.x.x)** — constitutional scoring logic  
- **Config Version (C.x.x.x)** — thresholds + parameters  

Each version evolves independently.

## Change Process
1. Propose change  
2. Review impact  
3. Publish draft  
4. Approve version bump  
5. Update CHANGELOG  
6. Release new version  

No silent changes are allowed.

## Public Disclosure
Every scoring output must disclose:
- engineVersion  
- rulesetVersion  
- configVersion  

This ensures reproducibility and auditability.

## Roles
- **Maintainers** — manage ruleset + engine  
- **Auditors** — verify transparency + correctness  
- **Integrators** — implement AXIOMS in products  

## Conclusion
The governance model ensures AXIOMS remains transparent, deterministic, and
trustworthy as it evolves.
