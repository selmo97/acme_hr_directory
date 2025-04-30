const express = require('express') //web server
const morgan = require('morgan');
 const pg = require('pg'); //library to connect to PostgresSQL db
 const { Client } = pg; //specific class you use to make that connection

 //creating DB connection
 const client = new Client({
  user: 'selenamoss',
  password: '',
  host: 'localhost',
  port: 5432,
  database: 'the_acme_hr_db',
 })

 //creating the express App + Port
 const app = express()
 const port = 3000
 app.use(express.json()); // so u can read JSON from the body
 app.use(morgan('dev'));

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
app.get('/api/employees', async (req,res) => {
    const result = await client.query('SELECT * FROM employees');
    res.json(result.rows);
})

/*
GET /api/departments: 
- Returns an array of departments.
*/
app.get('/api/departments', async (req,res) => {
    const result = await client.query('SELECT * FROM departments');
    res.json(result.rows);
})

/*
POST /api/employees:
- Returns a created employee. 
- The payload is the employee to create.
*/
app.post('/api/employees', async (req,res) => {
    const { name, department_id } = req.body;
    const result = await client.query('INSERT INTO employees (name, department_id) VALUES ($1, $2) RETURNING *', 
        [name, department_id]
    );
    res.json(result.rows[0])
})

/*
DELETE /api/employees/:id:
- Returns nothing.
- The ID of the employee to delete is passed in the URL.
*/
app.delete('/api/employees/:id', async (req,res) => {
    const { id } = req.params;
    const result = await client.query('DELETE FROM employees WHERE id = $1', 
        [id])
        res.sendStatus(204) //means: successful, no content
});

/*
PUT /api/employees/:id:
- Returns an updated employee.
- The payload is the employee to update.
*/
app.put('/api/employees/:id', async (req,res) => {
    const { id } = req.params;
    const { name, department_id } = req.body;
    const result = await client.query(
        'UPDATE employees SET name = $1, department_id = $2 WHERE id = $3 RETURNING *',
        [name, department_id, id]
    );
        res.json(result.rows[0]);
});

startServer();


