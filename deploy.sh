#!/bin/bash

git fetch --all
git reset --hard origin/main

cd server

gcloud builds submit --tag gcr.io/exploding-pigs-server-deploy/socket-server

gcloud run deploy socket-server \
  --image gcr.io/exploding-pigs-server-deploy/socket-server \
  --platform managed \
  --region europe-central2 \
  --max-instances 1 \
  --session-affinity \
  --timeout=3600