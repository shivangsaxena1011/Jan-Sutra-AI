# Validation & Release Scope

## Verified in the build workspace

- Python source compiles with `python -m compileall -q app scripts training`.
- FastAPI application imports and exposes `/health`.
- Four pytest tests pass, covering multilingual baseline classification, unknown-category fallback, citizen registration/duplicate account rejection, role-based access, assistant triage, complaint creation, same-ward/same-category incident linking, officer resolution and citizen-confirmed closure.
- The optional scikit-learn training script runs against the included illustrative CSV. Its small-set cross-validation macro-F1 was 0.381 in this environment; this is not a valid production benchmark and must not be presented as one.
- JSON manifests parse successfully.

## Not verified in this workspace

- The frontend dependencies could not be installed because this execution environment could not resolve `registry.npmjs.org`. Therefore `next build`, browser testing and end-to-end UI automation were not run here.
- Docker is not installed in this execution environment; the Compose stack was not built or started.
- No public hosting account, production domain, PostgreSQL service or municipal integration credentials were supplied, so no external deployment was performed.

## Functionality included in the source

- Public product landing page.
- Citizen registration and login.
- Citizen dashboard, complaint list and case-history timeline.
- Guided JanSahayak multilingual complaint intake (Hindi, English and limited Hinglish detection/phrases).
- Baseline category and department recommendation with a human-readable explanation.
- Master incident creation and conservative linking by category + ward + 14-day active incident window.
- Officer/admin queue and status workflow.
- Citizen confirmation, dispute or partial-resolution response.
- CivicPulse incident register and category distribution.
- PostgreSQL/SQLite support, demo seeding, staff provisioning script and container definitions.

## Explicitly outside this release

- Official government/municipal integration, verified ward boundaries, live civic asset GIS or CPGRAMS connectivity.
- General-purpose translation, speech-to-text, text-to-speech or robust coverage of all scheduled Indian languages.
- Production semantic embedding/geospatial incident clustering, verified root-cause inference or predictive infrastructure failure forecasting.
- Photo evidence upload, image forensics, face/plate redaction or proof-of-repair computer vision.
- OTP/email verification, password reset, rate limiting, managed identity, secure BFF cookie sessions, Alembic migrations, monitoring and penetration testing.

This release is a substantive, runnable product prototype and a publishable codebase, but public-sector production operation requires the security, data governance, localization, integration and validation work described in the README.
