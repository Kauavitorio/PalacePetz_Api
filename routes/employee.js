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

//  Method to get a customer
router.get('/custumer/get/:id_user', employeeController.GetAUserInfo)

//  Method to edit a customer
router.patch('/custumer/edit/', employeeController.UpdateCustomerProfile)

//  Method to get All Shceduled Serivces
router.get('/services/scheduled/:id_employee', employeeController.GetScheduledServices)

//  Method to get Shceduled Serivces Details
router.get('/services/scheduled/details/:id_employee/:cd_schedule/:id_user', employeeController.GetDetailsForAnScheduledService)

//  Method to get all order
router.get('/order/get/:id_employee', employeeController.GetAllOrders)

//  Method to get all order
router.get('/order/get/details/:id_employee/:cd_order', employeeController.GetOrdersDetails)

//  Method to update order
router.patch('/order/update/:id_employee', employeeController.UpdateOrderStatus)

//  Method to get Schedule Details
router.get('/schedule/info/:id_employee/:cd_schedule', employeeController.GetSheduleDetails)

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