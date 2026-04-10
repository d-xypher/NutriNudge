#!/bin/bash
PROJECT_ID=$1
if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./deploy.sh YOUR_PROJECT_ID"
  exit 1
fi
IMAGE="gcr.io/$PROJECT_ID/nutrinudge"
docker build -t $IMAGE .
docker push $IMAGE
gcloud run deploy nutrinudge \
  --image $IMAGE \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY,FIRESTORE_PROJECT_ID=$PROJECT_ID \
  --port 8080
