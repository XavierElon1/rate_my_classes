To configure db, set ATLAS_URI in your enviroment to the MongoDB connection string:

    export ATLAS_URI='My MongoDB Node connection string'
    
Set the following requirements for authorization flow:

    export JWT_TOKEN='My random encryption string'
    export MANAGEMENT_EMAIL='My email used for restricted endpoints'
    export SMTP_HOST='smtp.gmail.com'
    export SMTP_PORT='465'

Then use the configure script to inject this variable to the appropriate file.

    ./configure.sh
    
Install dependencies
    
    npm install
    
Run tests

    npm run test
    
To run in development:

    nodemon server.js
    
Access the service at http:localhost:5000 
