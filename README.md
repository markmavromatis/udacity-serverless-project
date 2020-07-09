# Udacity Serverless Project (Reminders App)

In this project I implemented the backend services to support a simple Todos Web Application. The front-end code, a React web application, was provided by the Udacity team.

The services are implemented using [Serverless Framework](https://www.serverless.com), a framework that enables developers to define cloud services in a YAML file that can be stored in source control alongside the code that implements these services.

This project uses several AWS services including:

DynamoDB - A NoSQL database to store reminders
S3 - File storage for reminder image attachments
Lambda Functions - Code that implements services to create, read, update, and delete reminders
IAM - Permissions that restrict permissions on each lambda function 

The project uses [Auth0](https://auth0.com) for user authentication.

## Installation instructions

AWS CLI should be installed before running these commands.

1. Create an application on Autho0 and record the domain and client ID.
2. From the terminal, go to the backend/ folder.
3. Install the backend dependencies using the command: `npm install`
4. Deploy the backend code to AWS by running `sls deploy -v`
5. Record the AWS API ID from the log 
6. Go to the client/ folder.
7. Open the src/config.ts file and update the "apiId" field to match the ID in step 4.
8. Also update the Auth0 domain and clientId fields from step 1.
9. Start the client by running `npm start`

