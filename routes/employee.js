const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController')


//  Route to "login" Employee | Get just employee info
router.post('/informations', employeeController.GetEmployeeInformation)

// -----  Manager Actions -------

//  Route to register an employee
router.post('/register-employee', employeeController.RegisterEmployee)

//  Route to get all employers
router.get('/employee/:c', employeeController.ListEmployee)

//  Route to update an employee
router.patch('/update-employee', employeeController.UpdateEmployee)

//  Route to delete an employee
router.delete('/delete-employee', employeeController.DeleteEmployee)

module.exports = router