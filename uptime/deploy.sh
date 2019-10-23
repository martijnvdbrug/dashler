#!/bin/bash
gcloud functions deploy uptime_batchUrlsToPubsub --runtime=nodejs10 --trigger-http --region=europe-west1 --timeout=60 --project=dasher-253813
# gcloud functions deploy uptime-urls-to-poll --runtime nodejs10 --trigger-topic TOPIC_NAME --region=europe-west1 --timeout=60 --project=dasher-253813
