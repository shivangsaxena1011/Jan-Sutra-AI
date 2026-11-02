# Model Card — JAN-SUTRA Complaint Classification Baseline

## Intended use

Assist a municipal triage workflow by suggesting a broad civic complaint category and department. Outputs are recommendations, not authoritative determinations.

## Current implementation

The default production path is an explainable keyword baseline for English, a limited set of Hindi terms and a limited set of Romanized Hindi/Hinglish phrases. A TF-IDF character n-gram + Logistic Regression model can be trained locally and loaded as an optional supplementary suggestion.

## Training starter set

`apps/api/training/data/grievances.csv` contains 30 handcrafted illustrative rows spanning five categories. It is not scraped from Kaggle, is not representative of real citizen language, and must not be described as an official or validated dataset. The repository does not make any model-accuracy claim.

## Known limitations

- Very small and narrow vocabulary.
- No general translation or speech recognition.
- Limited Hindi and Hinglish coverage.
- No formal language-specific performance study.
- Confidence values are heuristic / classifier probabilities and are not calibrated.
- Department routing depends on the local configured mapping, not verified jurisdiction data.
- Priority is a simple term-based suggestion and must not replace emergency triage.

## Required evaluation before deployment

Collect a legally obtained, representative and privacy-reviewed dataset. Use trained annotators and adjudication for ambiguous cases. Keep a held-out split by location and time. Report macro F1, class precision/recall, per-language results, confidence calibration, false routing rate, human-review rate and incident false-merge rate. Test for subgroup and language regressions. Obtain human approval before enabling automatic assignment.
