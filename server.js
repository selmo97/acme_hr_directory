const express = require('express') //web server
 const pg = require('pg'); //library to connect to PostgresSQL db
 const { Client } = pg; //specific class you use to make that connection

 //creating DB connection
 const client = new Client({
  user: 'selenamoss',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'tthe_acme_hr_db',
 })

 //creating the express App + Port
 const app = express()
 const port = 3000
 app.use(express.json()); // so u can read JSON from the body

//connecting to the DB THEN starting the Server using try catch
const startServer = async () => {
  try {
    await client.connect();
    console.log('🔌 Connected to database')

    //Start the server AFTER database connection is successful
app.listen(port, () => {
      console.log(`📟Server is listening on port ${port}`)
    });
  } catch (err) {
    console.error('❌Error connecting to the database:', err)
  }
};
//testing connection
app.get('/', (req, res) => {
  res.send('✨Server is running✨');
});

/*
GET /api/employees:
- Returns array of employees
*/

/*
GET /api/departments: 
- Returns an array of departments.
*/

/*
POST /api/employees:
- Returns a created employee. 
- The payload is the employee to create.
*/

/*
DELETE /api/employees/:id:
- Returns nothing.
- The ID of the employee to delete is passed in the URL.
*/

/*
PUT /api/employees/:id:
- Returns an updated employee.
- The payload is the employee to update.
*/

/*
An error handling route that you add and that returns an object with an error property
*/

