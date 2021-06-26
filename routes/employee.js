const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController')


//  Route to "login" Employee | Get just employee info
router.post('/informations', employeeController.GetEmployeeInformation)

//  Get an employee info
router.get('/informations/:id_user', employeeController.GetAnEmployeeInformation)

//  Update A Product
router.patch('/update/product', employeeController.UpdateProduct)

//  Delete A Product
router.delete('/delete/product/:id_employee/:cd_prod', employeeController.DeleteProduct)

//  Get All Customer
router.get('/customer/list/:id_employee', employeeController.GetAllCustomer)

//  Disable Customer
router.post('/customer/disable/', employeeController.DisableCustomerProfile)

//  Enable Customer
router.post('/customer/enable/', employeeController.EnableCustomerProfile)

// -----  Manager Actions -------

//  Route to register an employee
router.post('/register-employee', employeeController.RegisterEmployee)

//  Route to get all employers
router.get('/employee/:id_employee', employeeController.ListEmployee)

//  Route to update an employee
router.patch('/update-employee', employeeController.UpdateEmployee)

//  Route to delete an employee
router.delete('/delete-employee', employeeController.DeleteEmployee)

//  Route to get Company Statistics
router.post('/company/statistics', employeeController.GetStatistics)

module.exports = router