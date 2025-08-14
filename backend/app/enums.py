from enum import Enum


class ExpirationOption(str, Enum):
    one_hour = "1h"
    six_hours = "6h"
    one_day = "24h"
    one_week = "7d"
    one_month = "30d"
    one_year = "365d"
    indefinite = "never"
