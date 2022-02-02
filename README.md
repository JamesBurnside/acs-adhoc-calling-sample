# acs-adhoc-calling-sample

Quick sample demoing acs adhoc calling to a Teams user

## Setup

Install dependencies

```sh
npm run setup
```

## Run Locally

In one terminal window, start the server:

```sh
# Set environment variables
$env:ResourceConnectionString='<connection string>' # <-- powershell, differs per environment

# Navigate to server dir
cd server

# Start server
npm start
```

In another, start the app:

```sh
cd app
npm run start
```

## Deploy to Azure Web Apps

```sh
cd server
npm run build
cd ../app
npm run build
npm run package
# Deploy the dist directory
```
