const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Create a MySQL connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cruddata'
});

// Connect to the MySQL database
con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define the SQL query to insert an employee record
const insertEmployeeQuery = `INSERT INTO employe
                            (full_name, job_title, phone_number, email, address, city, state, primary_emergency_contact_name, primary_emergency_contact_phone, primary_emergency_contact_relationship, secondary_emergency_contact_name, secondary_emergency_contact_phone, secondary_emergency_contact_relationship)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

// Define the post route for adding an employee
app.post('/employees', addEmployee);


function addEmployee(req, res) {
  const { fullName, jobTitle, phoneNumber, email, address, city, state, primaryEmergencyContact, secondaryEmergencyContact } = req.body;

  const { name: primaryName, phoneNumber: primaryPhone, relationship: primaryRelationship } = primaryEmergencyContact;

  
  const { name: secondaryName, phoneNumber: secondaryPhone, relationship: secondaryRelationship } = secondaryEmergencyContact;

  // Execute the SQL query with the employee data
  con.query(
    insertEmployeeQuery,
    [fullName, jobTitle, phoneNumber, email, address, city, state, primaryName, primaryPhone, primaryRelationship, secondaryName, secondaryPhone, secondaryRelationship],
    function(err, result) {
      if (err) {
        console.error('Error inserting employee:', err);
        return res.status(500).json({ error: 'Failed to insert employee' });
      }
      console.log('Employee inserted successfully');
      res.status(200).json({ message: 'Employee inserted successfully' });
    }
  );
}


app.get('/employees/list', getEmployees);

function getEmployees(req, res) {
  const selectEmployeesQuery = 'SELECT * FROM employe';

  con.query(selectEmployeesQuery, function(err, result) {
    if (err) {
      console.error('Error retrieving employees:', err);
      return res.status(500).json({ error: 'Failed to retrieve employees' });
    }
    res.status(200).json(result);
  });
}


app.delete('/employees/:id', deleteEmployee);

function deleteEmployee(req, res) {
  const employeeId = req.params.id;
  const deleteEmployeeQuery = `DELETE FROM employe WHERE id = ?`;

  con.query(deleteEmployeeQuery, [employeeId], function(err, result) {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    console.log('Employee deleted successfully');
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
}



app.put('/employees/:id', updateEmployee);

function updateEmployee(req, res) {
  const employeeId = req.params.id;
  const { fullName, jobTitle, phoneNumber, email, address, city, state, primaryEmergencyContact, secondaryEmergencyContact } = req.body;
  const { name: primaryName, phoneNumber: primaryPhone, relationship: primaryRelationship } = primaryEmergencyContact;
  const { name: secondaryName, phoneNumber: secondaryPhone, relationship: secondaryRelationship } = secondaryEmergencyContact;

  const updateEmployeeQuery = `UPDATE employe SET 
                              full_name = ?, 
                              job_title = ?, 
                              phone_number = ?, 
                              email = ?, 
                              address = ?, 
                              city = ?, 
                              state = ?, 
                              primary_emergency_contact_name = ?, 
                              primary_emergency_contact_phone = ?, 
                              primary_emergency_contact_relationship = ?, 
                              secondary_emergency_contact_name = ?, 
                              secondary_emergency_contact_phone = ?, 
                              secondary_emergency_contact_relationship = ?
                              WHERE id = ?`;

  con.query(
    updateEmployeeQuery,
    [fullName, jobTitle, phoneNumber, email, address, city, state, primaryName, primaryPhone, primaryRelationship, secondaryName, secondaryPhone, secondaryRelationship, employeeId],
    function(err, result) {
      if (err) {
        console.error('Error updating employee:', err);
        return res.status(500).json({ error: 'Failed to update employee' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      console.log('Employee updated successfully');
      res.status(200).json({ message: 'Employee updated successfully' });
    }
  );
}

app.get('/employees', getEmployees);

function getEmployees(req, res) {
  const { page, limit } = req.query;
  const offset = (page - 1) * limit;
  const selectEmployeesQuery = `SELECT * FROM employe LIMIT ${limit} OFFSET ${offset}`;

  con.query(selectEmployeesQuery, function(err, result) {
    if (err) {
      console.error('Error retrieving employees:', err);
      return res.status(500).json({ error: 'Failed to retrieve employees' });
    }
    res.status(200).json(result);
  });
}

process.on('exit', function() {
  con.end();
});


app.listen(3001,()=>{
    console.log("server is running!!")
})
