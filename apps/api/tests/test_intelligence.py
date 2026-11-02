from app.services.intelligence import classify_complaint, detect_language


def test_hinglish_water_complaint():
    result = classify_complaint("Hamare area mein kal se paani nahi aa raha hai")
    assert result["category"] == "Water Supply"
    assert result["department"] == "Water Supply Department"
    assert result["language"] == "hinglish"


def test_hindi_drainage_complaint():
    result = classify_complaint("नाली का पानी सड़क पर आ रहा है")
    assert result["category"] == "Drainage & Sewerage"
    assert detect_language("नाली का पानी") == "hi"


def test_unknown_routes_to_helpdesk():
    result = classify_complaint("I need help with a municipal matter")
    assert result["department"] == "Municipal Helpdesk"
    assert result["confidence"] < 0.5
