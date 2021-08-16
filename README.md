# How to run ChangePassword service

## Project Directory Structure
- Main app: app.js
- Mock data: db.json
- Dockerfile
- Postman files including ChangePasswordAPI.postman_collection.json and passwordEnv.postman_environment.json

## How to run the service and execute the automated test
1. Start the service manually using
      ```
      npm install
      ```
      ```
      npm start
      ```
2. Start the service as a Docker container
      ```
      docker build . -t changepwd
      ```
      ```
      docker run -p 3000:3000 --name my-changepwd -d changepwd
      ```
3. Execute the automated test using newman
      ```
      npm install newman
      ```
      ```
      newman run ChangePasswordAPI.postman_collection.json -e passwordEnv.postman_environment.json
      ```
      or if you want a report in JSON format, please use the command below
      ```
      newman run ChangePasswordAPI.postman_collection.json -e passwordEnv.postman_environment.json --reporters cli,json --reporter-json-export outputfile.json
      ```