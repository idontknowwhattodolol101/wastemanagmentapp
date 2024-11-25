# Smart Waste Management App

This project is a web application that allows users to upload images of waste items and determines whether they are recyclable or not using AWS services. The app integrates AWS Amplify, AWS Lambda, Rekognition, API Gateway, DynamoDB, and S3 for a seamless user experience and backend automation.

## Features:

- User Authentication:  Sign in via AWS Cognito.
- Image Upload: Users upload waste images that are stored in an S3 bucket.
- Recyclability Check: Uses AWS Rekognition to determine if the item is recyclable.
- Data Storage: Analysis results are saved in DynamoDB.
- API Integration: API Gateway connects the backend to the frontend.

### Getting Started

Before you can run this project, ensure you have the following installed:

Node.js (v16 or later)
AWS Amplify CLI (npm install -g @aws-amplify/cli)
AWS Account
A GitHub account (for connecting to AWS Amplify)

#### Steps to Set Up

1) Clone this repo to your local machine using the following command:

git clone https://github.com/your-username/smart-waste-management.git

cd smart-waste-management

2) Install Dependencies

   - npm install

3) Configure the AWS Amplify CLI

   -amplify configure

4) Intalise the amplify project

   -amplify init

5) Set up user authentication with Cognito:

   -amplify add auth

6) Set up S3 storage for image uploads:

   -amplify add storage

7) Push changes

   -amplify push

8) Run the app locally

   -npm start
   

