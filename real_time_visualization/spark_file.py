from pyspark.sql import SparkSession
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import StructType, StringType, FloatType
import json
import requests

def send_to_backend(row):
    try:
        data = row.asDict()
        requests.post("http://localhost:5000/api/stream", json=data)
    except Exception as e:
        print("POST failed:", e)

spark = SparkSession.builder \
    .appName("KafkaToExpress") \
    .getOrCreate()

df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "stock-ticks") \
    .load()

schema = StructType() \
    .add("date", StringType()) \
    .add("close", FloatType()) \
    .add("Name", StringType())

parsed = df.selectExpr("CAST(value AS STRING)") \
    .select(from_json(col("value"), schema).alias("data")) \
    .select("data.*")

query = parsed.writeStream.foreach(send_to_backend).start()
query.awaitTermination()
