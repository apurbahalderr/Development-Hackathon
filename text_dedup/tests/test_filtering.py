from datetime import datetime, timedelta
from text_dedup.filtering import filter_recent_incidents


def test_time_window_filtering():
    new_incident = {
        "text": "Fire",
        "area_id": "sector_1",
        "timestamp": datetime.now()
    }

    past_incidents = [
        {
            "text": "Fire earlier",
            "area_id": "sector_1",
            "timestamp": datetime.now() - timedelta(hours=4)
        }
    ]

    result = filter_recent_incidents(new_incident, past_incidents)
    assert result == []
