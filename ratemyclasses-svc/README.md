To configure app, set ATLAS_URI in your enviroment to the MongoDB connection string:

    export ATLAS_URI='My MongoDB Node connection string'
    
Then use the configure script to inject this variable to the appropriate file.

    ./configure.sh
    
Install dependencies
    
    npm install
    
Run tests

    npm run test
    
To run in development:

    nodemon server
    
Access the service at http:localhost:5000 
