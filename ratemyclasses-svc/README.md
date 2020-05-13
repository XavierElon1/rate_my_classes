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

To obtain a token from the authorization endpoint:

Send a POST request to http:localhost:5000/auth with the following JSON body:

	{
		"email": "student@institution.edu",
		"redirect": "http://front-end/page"
	}

A token will be sent to the email address in the body.

This token will grant write access to data related to institution.edu, if the institution exists in the database.

Tokens from the management email have read/write access to all endpoints.
