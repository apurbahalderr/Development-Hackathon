from datetime import datetime, timedelta
import math


TIME_WINDOW_HOURS = 3
GEO_RADIUS_KM = 2.0


def within_time_window(old_time: datetime, new_time: datetime) -> bool:
    return new_time - old_time <= timedelta(hours=TIME_WINDOW_HOURS)


def haversine_distance(lat1, lon1, lat2, lon2) -> float:
    R = 6371  # Earth radius in km

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def filter_recent_incidents(
    new_incident: dict,
    past_incidents: list
) -> list:

    new_time = new_incident["timestamp"]
    filtered = []

    for incident in past_incidents:
        # 1️⃣ Time filter
        if not within_time_window(incident["timestamp"], new_time):
            continue

        # 2️⃣ Geo-based filtering
        if "latitude" in new_incident and "longitude" in new_incident:
            if "latitude" not in incident or "longitude" not in incident:
                continue

            distance = haversine_distance(
                new_incident["latitude"],
                new_incident["longitude"],
                incident["latitude"],
                incident["longitude"]
            )

            if distance <= GEO_RADIUS_KM:
                filtered.append(incident)

        # 3️⃣ Area-based filtering
        elif "area_id" in new_incident:
            if incident.get("area_id") == new_incident["area_id"]:
                filtered.append(incident)

    return filtered
