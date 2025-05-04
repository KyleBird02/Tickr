import json
import time
import threading
from kafka import KafkaProducer
from kafka.errors import KafkaError

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

# Load data
with open("daily_ticks.json", "r") as file:
    all_days = json.load(file)

print(f"📁 Loaded {len(all_days)} days")

day_index = 100

def emit_day_data(day_data, date_str, result_flag):
    try:
        for i, stock in enumerate(day_data):
            producer.send('stock-ticks', stock)
        producer.flush()
        print(f"✅ Flushed {len(day_data)} stocks for {date_str}")
        result_flag.append(True)
    except KafkaError as e:
        print(f"❌ Kafka error on day {date_str}:", e)
    except Exception as e:
        print(f"❌ Unknown error on day {date_str}:", e)

while day_index < len(all_days):
    current_day = all_days[day_index]
    date_str = current_day[0].get('date', 'Unknown')

    print(f"\n📤 Emitting Day {day_index + 1} - Date: {date_str}")

    result_flag = []
    t = threading.Thread(target=emit_day_data, args=(current_day, date_str, result_flag))
    t.start()
    t.join(timeout=3)

    if not result_flag:
        day_index = 100
        print(f"⚠️ Timeout: Skipping day {date_str}")
    else:
        print(f"✅ Finished day {date_str}")

    day_index += 1
    time.sleep(1)
