To configure app, set ATLAS_URI in your enviroment to the MongoDB connection string:
    export ATLAS_URI='My MongoDB Node connection string'
Then use the configure script to inject this variable to the appropriate file.
    ./configure.sh
To run in development, run:
    nodemon server