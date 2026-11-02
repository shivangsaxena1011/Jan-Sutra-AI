"""Train an optional baseline text classifier from a labelled CSV.

Usage: python training/train_classifier.py --input training/data/grievances.csv
The included CSV is a small illustrative starter set, not a benchmark dataset.
Replace/expand it with properly licensed, human-labelled data before reporting metrics.
"""
import argparse
from pathlib import Path
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, StratifiedKFold

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default="training/data/grievances.csv")
    parser.add_argument("--output", default="artifacts/grievance_classifier.joblib")
    args = parser.parse_args()
    source = Path(args.input)
    if not source.is_absolute():
        source = ROOT / source
    frame = pd.read_csv(source)
    if not {"text", "label"}.issubset(frame.columns):
        raise SystemExit("CSV must contain text,label columns")
    frame = frame.dropna(subset=["text", "label"])
    counts = frame.label.value_counts()
    if len(counts) < 2 or counts.min() < 2:
        raise SystemExit("Need at least two examples per category")
    model = Pipeline([
        ("tfidf", TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 5), min_df=1, sublinear_tf=True)),
        ("classifier", LogisticRegression(max_iter=1500, class_weight="balanced")),
    ])
    splits = min(3, int(counts.min()))
    scores = cross_val_score(model, frame.text.astype(str), frame.label.astype(str), cv=StratifiedKFold(n_splits=splits, shuffle=True, random_state=42), scoring="f1_macro")
    model.fit(frame.text.astype(str), frame.label.astype(str))
    output = Path(args.output)
    if not output.is_absolute():
        output = ROOT / output
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output)
    print(f"Saved model: {output}")
    print(f"Training rows: {len(frame)} | Categories: {len(counts)}")
    print(f"Cross-validation macro-F1 (small illustrative set): mean={scores.mean():.3f}, folds={scores.round(3).tolist()}")
    print("Do not present these starter-set scores as production performance.")


if __name__ == "__main__":
    main()
