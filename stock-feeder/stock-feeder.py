import json
import time
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

with open("daily_ticks.json", "r") as file:
    all_days = json.load(file)

day_index = 0

while day_index < len(all_days):
    current_day = all_days[day_index]
    for stock in current_day:
        producer.send('stock-ticks', stock)
    producer.flush()

    print(f"✅ Emitted Day {day_index + 1} - Date {current_day[0]['date']}")
    
    day_index += 1
    time.sleep(5)  # Wait 10 seconds between each day
