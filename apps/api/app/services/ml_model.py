from functools import lru_cache
from pathlib import Path
import joblib
from app.core.config import settings


@lru_cache(maxsize=1)
def load_classifier():
    path = Path(settings.model_path)
    if not path.is_absolute():
        path = Path.cwd() / path
    if path.exists():
        try:
            return joblib.load(path)
        except Exception:
            return None
    return None


def predict_category(text: str):
    model = load_classifier()
    if model is None:
        return None
    try:
        predicted = model.predict([text])[0]
        probabilities = model.predict_proba([text])[0]
        confidence = float(max(probabilities))
        return str(predicted), confidence
    except Exception:
        return None
