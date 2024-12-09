import json
from datetime import datetime, timedelta

if True:
    date_list = {}
    index = 0

    start_date = datetime(2024, 1, 1)
    end_date = datetime(2090, 12, 31)

    current_date = start_date
    while current_date <= end_date:
        formatted_date = current_date.strftime('%d.%m.%Y')
        date_list[formatted_date] = index
        index = (index + 1) % 2  # This ensures index resets to 0 after reaching 1
        current_date += timedelta(days=1)

    with open('dates.json', 'w') as file:
        json.dump(date_list, file)