#!/bin/bash

echo "Running migrations"
npx prisma migrate dev

echo "Building the app"
npm run build

echo "Starting the app"
npm run start:prod