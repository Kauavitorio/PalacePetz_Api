const mysql = require('../mysql')
const EncryptDep = require('./encryption')
const Server = require('../ServerInfo') 
const badWords = require('./badWords')
const BadWords = require('../controllers/badWords')
const bcrypt = require('bcrypt');
const ServerDetails = require('../ServerInfo'); 
const { response } = require('express');
const _IMG_DEFAULT = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';

//  Method to get information about self
exports.GetEmployeeInformation = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_user = req.body.id_user
        var result = await mysql.execute('SELECT * FROM tbl_employers WHERE id_user = ?', id_user)
        if(result.length > 0){
            const response = {
                id_employee: result[0].id_employee,
                role: EncryptDep.Decrypt(result[0].role),
                number_ctps: EncryptDep.Decrypt(result[0].number_ctps)
            }
            return res.status(200).send(response)
        }else
        return res.status(204).send({ message: 'Employee is not registred!!'})
    } catch (error) {
        Server.RegisterServerError("Get Employee Information", error.toString());
        return res.status(500).send({ error: error})
    }
}

exports.GetAUserInfo = async (req, res, next) => {
    try {
        var result = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', req.params.id_user)
        const response = {
            Search: result.map(account => {
                return {
                    id_user: account.id_user,
                    name_user: EncryptDep.Decrypt(account.name_user),
                    email: EncryptDep.Decrypt(account.email),
                    cpf_user: EncryptDep.Decrypt(account.cpf_user),
                    address_user: EncryptDep.Decrypt(account.address_user),
                    complement: EncryptDep.Decrypt(account.complement),
                    zipcode: EncryptDep.Decrypt(account.zipcode),
                    phone_user: EncryptDep.Decrypt(account.phone_user),
                    birth_date: EncryptDep.Decrypt(account.birth_date),
                    user_type: account.user_type,
                    img_user: EncryptDep.Decrypt(account.img_user),
                    status: account.status
                }
            })
            }
        return res.status(200).send(response)
    } catch (error) {
        
    }
}

//  Method to get information about one employee
exports.GetAnEmployeeInformation = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_user = req.params.id_user
        var result = await mysql.execute(`select 
        account.*,
        employee.id_employee,
        employee.role,
        employee.number_ctps
        from tbl_account as account inner join tbl_employers as employee
        on account.id_user = employee.id_user WHERE account.id_user = ?;`, id_user)
        if(result.length > 0){
            var num_crmv = "";
            if(result[0].user_type == 2){
                var result_vety = await mysql.execute('SELECT num_crmv FROM tbl_veterinary WHERE id_user = ?', id_user)
                num_crmv = EncryptDep.Decrypt(result_vety[0].num_crmv)
            }
            const response = {
                Search: result.map(employee => {
                    return {
                        id_user: parseInt(employee.id_user),
                        name_user: EncryptDep.Decrypt(employee.name_user),
                        username: EncryptDep.Decrypt(employee.username),
                        email: EncryptDep.Decrypt(employee.email),
                        cpf_user: EncryptDep.Decrypt(employee.cpf_user),
                        address_user: EncryptDep.Decrypt(employee.address_user),
                        complement: EncryptDep.Decrypt(employee.complement),
                        zipcode: EncryptDep.Decrypt(employee.zipcode),
                        phone_user: EncryptDep.Decrypt(employee.phone_user),
                        birth_date: EncryptDep.Decrypt(employee.birth_date),
                        user_type: parseInt(employee.user_type),
                        img_user: EncryptDep.Decrypt(employee.img_user),
                        id_employee: parseInt(employee.id_employee),
                        role: EncryptDep.Decrypt(employee.role),
                        num_crmv: num_crmv,
                        number_ctps: EncryptDep.Decrypt(employee.number_ctps)
                    }
                })
                }
            return res.status(200).send(response)
        }else
        return res.status(204).send({ message: 'Employee is not registred!!'})
    } catch (error) {
        Server.RegisterServerError("Get Employee Information", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to register Employee 
exports.RegisterEmployee = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        // USER INFORMATION
        var name_user = req.body.name_user
        var email = req.body.email
        var cpf_user = req.body.cpf_user
        var address_user = req.body.address_user
        var complement = req.body.complement
        var zipcode = req.body.zipcode
        var birth_date = req.body.birth_date
        var user_type_insert = req.body.user_type
        var img_user = req.body.img_user
        var password = req.body.password
        var phone_user = req.body.phone_user
        var role = req.body.role
        var number_ctps = req.body.number_ctps
        var verify_id = "Confirmed"
        var verify = 1 
        var num_crmv = req.body.num_crmv // END USER INFORMATION

        if(img_user == null || img_user == "" || img_user == " " || img_user.length <= 12 )
            img_user = _IMG_DEFAULT

        //  Array to know if user is already registered
        var test_insert_array = []

        var Test_Insert = await mysql.execute('SELECT * FROM tbl_account')
        for (let i = 0; i < Test_Insert.length; i++){
            var Email_GET = EncryptDep.Decrypt(Test_Insert[i].email)
            if(Email_GET == email)
                test_insert_array.push(Test_Insert[i].id_user)
        }

        if(test_insert_array.length <= 0){
            var id_employee = req.body.id_employee;
            var Test_select = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_employee)
            if(Test_select.length > 0){
                
            var user_type = Test_select[0].user_type;
            if (user_type <= 2) return res.status(401).send({message: 'You can not register employers'})
            else{
                if(!badWords.VerifyUsername(name_user)){
                    const hash = await bcrypt.hashSync(password, 13);
                    var result_user = await mysql.execute('INSERT INTO tbl_account (name_user, email, cpf_user, address_user, complement, zipcode, phone_user, birth_date, user_type, img_user, password, verify_id, verify) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [EncryptDep.Encrypto(name_user), EncryptDep.Encrypto(email), EncryptDep.Encrypto(cpf_user), EncryptDep.Encrypto(address_user), EncryptDep.Encrypto(complement), EncryptDep.Encrypto(zipcode), EncryptDep.Encrypto(phone_user), EncryptDep.Encrypto(birth_date), user_type_insert, EncryptDep.Encrypto(img_user), hash, verify_id, verify]);

                    var result_employee = await mysql.execute('INSERT tbl_employers (role, number_ctps, id_user) VALUES (?, ?, ?);', [ EncryptDep.Encrypto(role), EncryptDep.Encrypto(number_ctps), result_user.insertId ])
                    const response = {
                        message: 'Successfully inserted',
                        id_employee: result_employee.insertId
                    }

                    if (user_type_insert == 2)
                        await mysql.execute('INSERT INTO tbl_veterinary (id_user, id_employee, num_crmv) VALUES (?, ?, ?)', [ result_user.insertId, result_employee.insertId, EncryptDep.Encrypto(num_crmv) ])
                    
                    var splitFuncName = name_user.split(' ')
                    var id_insert = result_user.insertId;   
                    this.UpdateUserNameIntern(id_insert, "palace" + splitFuncName[0].toLowerCase())
                    return res.status(201).send(response)
                }else
                    return res.status(406).send({ message: 'Employee name is not allowed' }) 
                }
            }else
                return res.status(401).send({message: 'You can not register employers'})
        }else
            return res.status(409).send({ message: 'This user is already registered' })

    } catch (error) {
        Server.RegisterServerError("Register Employee", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to list All employers
exports.ListEmployee = async(req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.params.id_employee;
        var Test_select = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_employee)
        if(Test_select.length > 0){
            var user_type = Test_select[0].user_type;
            if (user_type <= 2) return res.status(401).send({message: 'You can not see employers'})
            else{
                var result = await mysql.execute(`select 
                account.*,
                employee.id_employee,
                employee.role,
                employee.number_ctps
                from tbl_account as account inner join tbl_employers as employee
                on account.id_user = employee.id_user;`)

                const response = {
                    Search: result.map(employee => {
                        return {
                            id_user: parseInt(employee.id_user),
                            name_user: EncryptDep.Decrypt(employee.name_user),
                            username: EncryptDep.Decrypt(employee.username),
                            email: EncryptDep.Decrypt(employee.email),
                            cpf_user: EncryptDep.Decrypt(employee.cpf_user),
                            address_user: EncryptDep.Decrypt(employee.address_user),
                            complement: EncryptDep.Decrypt(employee.complement),
                            zipcode: EncryptDep.Decrypt(employee.zipcode),
                            phone_user: EncryptDep.Decrypt(employee.phone_user),
                            birth_date: EncryptDep.Decrypt(employee.birth_date),
                            user_type: parseInt(employee.user_type),
                            img_user: EncryptDep.Decrypt(employee.img_user),
                            id_employee: parseInt(employee.id_employee),
                            role: EncryptDep.Decrypt(employee.role),
                            number_ctps: EncryptDep.Decrypt(employee.number_ctps)
                        }
                    })
                    }
                return res.status(200).send(response)
            }
        }else
            return res.status(401).send({message: 'You can not see employers'})
    } catch (error) {
        Server.RegisterServerError("Get All Employee", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

//  Method to update an employee
exports.UpdateEmployee = async(req, res, next) => {
    try {
        ServerDetails.showRequestId()
        // USER INFORMATION
        var name_user = req.body.name_user
        var cpf_user = req.body.cpf_user
        var address_user = req.body.address_user
        var complement = req.body.complement
        var zipcode = req.body.zipcode
        var birth_date = req.body.birth_date
        var user_type = req.body.user_type
        var img_user = req.body.img_user
        var phone_user = req.body.phone_user
        var role = req.body.role
        var number_ctps = req.body.number_ctps
        var password = req.body.password;
        var id_user = req.body.id_user
        var num_crmv = req.body.num_crmv
        var user_type_insert = req.body.user_type // END USER INFORMATION

        if(img_user == null || img_user == "" || img_user == " " || img_user.length <= 12 )
            img_user = _IMG_DEFAULT

        var id_employee = req.body.id_employee;
        var Test_select = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_employee)
        if(Test_select.length > 0){
            
        var Test_Insert = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)

        if(Test_Insert.length > 0){
            var user_type = Test_select[0].user_type;
            if (user_type <= 2) return res.status(401).send({message: 'You can not update employers'})
            else{
            if(!badWords.VerifyUsername(name_user)){
                const hash = await bcrypt.hashSync(password, 13);
                await mysql.execute('UPDATE  tbl_account SET name_user = ? , cpf_user = ? , address_user = ? , complement = ?, zipcode = ?, phone_user = ?,  birth_date = ?, user_type = ?, img_user = ?, password = ? WHERE id_user = ?', [EncryptDep.Encrypto(name_user), EncryptDep.Encrypto(cpf_user), EncryptDep.Encrypto(address_user), EncryptDep.Encrypto(complement), EncryptDep.Encrypto(zipcode), EncryptDep.Encrypto(phone_user), EncryptDep.Encrypto(birth_date), user_type_insert, EncryptDep.Encrypto(img_user), hash, id_user]);

                await mysql.execute('UPDATE tbl_employers SET role = ?, number_ctps = ? WHERE id_user = ?', [ EncryptDep.Encrypto(role), EncryptDep.Encrypto(number_ctps), id_user ])

                if (user_type_insert == 2){
                    var result_veterinary = await mysql.execute('SELECT * FROM tbl_veterinary WHERE id_user = ?', id_user)
                    if(result_veterinary.length > 0)
                        await mysql.execute('UPDATE tbl_veterinary set num_crmv = ? WHERE id_user = ?', [ EncryptDep.Encrypto(num_crmv), id_user ])
                    else{
                        var result_employee = await mysql.execute('SELECT * FROM tbl_employers WHERE id_user = ?', id_user)
                        var id_employee = result_employee[0].id_employee
                        await mysql.execute('INSERT INTO tbl_veterinary (id_user, id_employee, num_crmv) VALUES (?, ?, ?)', [ id_user, id_employee, EncryptDep.Encrypto(num_crmv) ])
                    }

                }

                return res.status(200).send({message: 'OK'})
            }else
                return res.status(406).send({ message: 'Employee name is not allowed' }) 
            }
        }else
            return res.status(409).send({ message: 'This user is not registered' })

        }else
            return res.status(401).send({message: 'You can not update employers'})
        
    } catch (error) {
        Server.RegisterServerError("Update Employee", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to delete an employee
exports.DeleteEmployee = async(req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.body.id_employee;
        var Test_select = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_employee)
        if(Test_select.length > 0){
            var user_type = Test_select[0].user_type;
            if (user_type <= 2) return res.status(401).send({message: 'You can not see employers'})
            else{
                await mysql.execute('CALL spDelete_Employee(?)', req.body.id_user)
                return res.status(200).send({message: 'Employee has Sucessfully Delete'})
            }
        }else
            return res.status(401).send({message: 'You can not see employers'})
        
    } catch (error) {
        Server.RegisterServerError("Delete an Employee", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to delete a product
exports.DeleteProduct = async(req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.params.id_employee;
        var cd_prod = req.params.cd_prod;
        var Test_select = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_employee)
        if(Test_select.length > 0){
            return res.status(200).send({message: 'Product has Sucessfully Delete'})
        }else
            return res.status(401).send({message: 'You can not see employers'})
        
    } catch (error) {
        Server.RegisterServerError("Delete an Employee", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method for Update UserName
exports.UpdateUserNameIntern = async (id_user, username) => {
    try{
        var newUserName = username + id_user;
        var query = `UPDATE tbl_account SET 
            username = ?
                WHERE id_user = ?;`
            await mysql.execute(query, [EncryptDep.Encrypto(newUserName), id_user])
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile", error.toString());
    }
}

//  Method to update a product
exports.UpdateProduct = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var cd_prod = req.body.cd_prod
        var result_search = await mysql.execute('SELECT * FROM tbl_products WHERE cd_prod = ?', cd_prod)
        if(result_search.length > 0){
            await mysql.execute('UPDATE tbl_products set cd_category = ?, nm_product = ?, amount = ?, species = ?, product_price = ?, shelf_life = ?, image_prod = ?,description = ? WHERE cd_prod = ?', [ req.body.cd_category, req.body.nm_product, req.body.amount, req.body.species, req.body.product_price, req.body.shelf_life, req.body.image_prod, req.body.description, cd_prod ])
            return res.status(200).send({ message: 'OK' })
        }else
            return res.status(204).send({ message: 'Product not found' })
    } catch (error) {
        Server.RegisterServerError("Update Product", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to Get Statistics
exports.GetStatistics = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var user_amount = 0;

        //  Products amount vars
        var products_amount = 0;
        var qt_food = 0;
        var qt_medicines = 0;
        var qt_aesthetics = 0;
        var qt_accessories = 0; // END Products amount vars

        //  Percentage vars
        var food_percentage;
        var medicines_percentage;
        var aesthetics_percentage;
        var accessories_percentage; // END Percentage vars

        //  Get Users Amount
        var result_users = await mysql.execute('select count(*) as user_amount from tbl_account;')
        user_amount = result_users[0].user_amount

        //  Get Products Amount 
        var result_products = await mysql.execute('select count(*) as products_amount from tbl_products;')
        products_amount = result_products[0].products_amount

        //  Get Products Amount with category = food 
        var result_food = await mysql.execute('select count(*) as food_amount from tbl_products where cd_category = 4;')
        qt_food = result_food[0].food_amount

        //  Get Products Amount with category = medicines
        var result_medicines = await mysql.execute('select count(*) as medicines_amount from tbl_products where cd_category = 14;')
        qt_medicines = result_medicines[0].medicines_amount

        //  Get Products Amount with category = aesthetics
        var result_aesthetics = await mysql.execute('select count(*) as aesthetics_amount from tbl_products where cd_category = 34;')
        qt_aesthetics = result_aesthetics[0].aesthetics_amount

        //  Get Products Amount with category = accessories
        var result_accessories = await mysql.execute('select count(*) as accessories_amount from tbl_products where cd_category = 24;')
        qt_accessories = result_accessories[0].accessories_amount

        food_percentage = Math.trunc(qt_food / products_amount * 100);
        medicines_percentage = Math.trunc(qt_medicines / products_amount * 100);
        aesthetics_percentage = Math.trunc(qt_aesthetics / products_amount * 100);
        accessories_percentage = Math.trunc(qt_accessories / products_amount * 100);

        //  Get Order Prices
        var result_orders = await mysql.execute('select totalPrice from tbl_orders;')
        var totalPrice = 0.0;
        for (let i = 0; i < result_orders.length; i++){
            var price_get = EncryptDep.Decrypt(result_orders[i].totalPrice)
            totalPrice += parseFloat(price_get.replace(" ", "").replace("R$", ""))
        }

        const response = {
            user_amount: user_amount,
            products_amount: products_amount,
            food_percentage: food_percentage,
            medicines_percentage: medicines_percentage,
            aesthetics_percentage: aesthetics_percentage,
            accessories_percentage: accessories_percentage,
            totalPrice: totalPrice
        }
        return res.status(200).send(response)

    } catch (error) {
        Server.RegisterServerError("Get Statistics", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to get all customers
exports.GetAllCustomer = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.params.id_employee
        var result_Check = await mysql.execute('SELECT user_type FROM tbl_account WHERE id_user = ?;', id_employee)
        if(result_Check.length > 0){
            var user_type = result_Check[0].user_type
            if(user_type == 1 || user_type == 3){
                var result = await mysql.execute('SELECT * FROM tbl_account ORDER BY RAND();')
                const response = {
                    Search: result.map(account => {
                        return {
                            id_user: parseInt(account.id_user),
                            name_user: EncryptDep.Decrypt(account.name_user),
                            email: EncryptDep.Decrypt(account.email),
                            cpf_user: EncryptDep.Decrypt(account.cpf_user),
                            phone_user: EncryptDep.Decrypt(account.phone_user),
                            user_type: parseInt(account.user_type),
                            status: parseInt(account.status)
                        }
                    })
                    }
                return res.status(200).send(response)
            }else
                return res.status(401).send({message: 'You can not see customers'})
        }else
            return res.status(401).send({message: 'You can not see customers'})
    } catch (error) {
        Server.RegisterServerError("Get Customers", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method for Update Customer
exports.UpdateCustomerProfile = async (req, res, next) => {
    try{
        var try_password = req.body.password
        ServerDetails.showRequestId()
        var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
        var result = await mysql.execute(queryUser, req.body.id_user)
        if(result.length > 0){
            if(BadWords.VerifyUsername(req.body.name_user)){
                return res.status(406).send({ error: "Username not allowed"})                
            }else{
                if(try_password == null || try_password == "" || try_password == " " || try_password == "no update" || try_password.length < 8){
                    var query = `UPDATE tbl_account SET 
                    name_user = ?,
                    cpf_user = ?,
                    address_user = ?, 
                    complement = ?, 
                    zipcode = ?, 
                    phone_user = ?, 
                    birth_date = ?
                        WHERE id_user = ?;`
                    await mysql.execute(query, [EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.cpf_user), EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), EncryptDep.Encrypto(req.body.phone_user), EncryptDep.Encrypto(req.body.birth_date), req.body.id_user])
                    return res.status(200).send( { message: 'User information successfully update'} )
                }else{
                    const hash = await bcrypt.hashSync(try_password, 12);
                    var query = `UPDATE tbl_account SET 
                    name_user = ?,
                    cpf_user = ?,
                    address_user = ?, 
                    complement = ?, 
                    zipcode = ?, 
                    phone_user = ?, 
                    birth_date = ?,
                    password = ?
                        WHERE id_user = ?;`
                    await mysql.execute(query, [EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.cpf_user), EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), EncryptDep.Encrypto(req.body.phone_user), EncryptDep.Encrypto(req.body.birth_date), hash, req.body.id_user])
                    return res.status(200).send( { message: 'User information successfully update'} )
                }
                
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Desable Customer
exports.DisableCustomerProfile = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        var id_employee = req.body.id_employee
        var result_Check = await mysql.execute('SELECT user_type FROM tbl_account WHERE id_user = ?;', id_employee)
        if(result_Check.length > 0){
            var user_type = result_Check[0].user_type
            if(user_type == 1 || user_type == 3){
                var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
                var result = await mysql.execute(queryUser, req.body.id_user)
                if(result.length > 0){
                    var user_type_disable = result[0].user_type
                    if(user_type_disable == 3 )
                        return res.status(401).send({message: 'You can not disable customers'})
                    else{
                        await mysql.execute('UPDATE tbl_account SET status = 0 WHERE id_user = ?;', req.body.id_user)
                        return res.status(200).send( { message: 'User has been successfully disabled' } )
                    }
                }else
                    return res.status(404).send( { message: 'User not registered' } )
            }else
                return res.status(401).send({message: 'You can not disable customers'})
        }else
            return res.status(401).send({message: 'You can not disable customers'})
    }catch(error){
        ServerDetails.RegisterServerError("Disable Profile", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Enable Customer
exports.EnableCustomerProfile = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        var id_employee = req.body.id_employee
        var result_Check = await mysql.execute('SELECT user_type FROM tbl_account WHERE id_user = ?;', id_employee)
        if(result_Check.length > 0){
            var user_type = result_Check[0].user_type
            if(user_type == 1 || user_type == 3){
                var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
                var result = await mysql.execute(queryUser, req.body.id_user)
                if(result.length > 0){
                    var user_type_disable = result[0].user_type
                    if(user_type_disable == 3 )
                        return res.status(401).send({message: 'You can not disable customers'})
                    else{
                        await mysql.execute('UPDATE tbl_account SET status = 1 WHERE id_user = ?;', req.body.id_user)
                        return res.status(200).send( { message: 'User has been successfully enabled' } )
                    }
                }else
                    return res.status(404).send( { message: 'User not registered' } )
            }else
                return res.status(401).send({message: 'You can not disable customers'})
        }else
            return res.status(401).send({message: 'You can not disable customers'})
    }catch(error){
        ServerDetails.RegisterServerError("Enable Profile", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method to get all sheduled services
exports.GetScheduledServices = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.params.id_employee
        var result_Check = await mysql.execute('SELECT user_type FROM tbl_account WHERE id_user = ?', id_employee)
        if(result_Check.length > 0){
            var user_type_get = result_Check[0].user_type
            if(user_type_get > 0){
                var result = await mysql.execute(`select 
                schedules.*,
                veterinary.name_user as nm_veterinary,
                pet.nm_animal
                from tbl_schedules as schedules inner join tbl_pets as pet on pet.cd_animal = schedules.cd_animal
                LEFT join tbl_account as veterinary on CASE WHEN schedules.service_type = 1 THEN veterinary.id_user = schedules.cd_veterinary END;`)
                if (result.length > 0){
                    const response = {
                        Search: result.map(schedules => {
                            return {
                                cd_schedule: parseInt(schedules.cd_schedule),
                                id_user: parseInt(schedules.id_user),
                                date_schedule: EncryptDep.Decrypt(schedules.date_schedule),
                                time_schedule: EncryptDep.Decrypt(schedules.time_schedule),
                                cd_animal: parseInt(schedules.cd_animal),
                                cd_veterinary: parseInt(schedules.cd_veterinary),
                                description: EncryptDep.Decrypt(schedules.description),
                                nm_veterinary: EncryptDep.Decrypt(schedules.nm_veterinary),
                                nm_animal: EncryptDep.Decrypt(schedules.nm_animal),
                                service_type: parseInt(schedules.service_type),
                                delivery: parseInt(schedules.delivery),
                                status: parseInt(schedules.status)
                            }
                        })
                }
            return res.status(200).send(response)
        }else
            return res.status(204).send({ message: 'No Schedule for this user' })
            }else
                return res.status(401).send({ message: 'You can not see scheduled services' })
        }else
            return res.status(401).send({ message: 'You can not see scheduled services' })
    } catch (error) {
        ServerDetails.RegisterServerError("Get Scheduled Services", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method to get Sheduled Service Details
exports.GetDetailsForAnScheduledService = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_employee = req.params.id_employee
        var result_Check = await mysql.execute('SELECT user_type FROM tbl_account WHERE id_user = ?;', id_employee)
        if(result_Check.length > 0){
            var user_type_get = result_Check[0].user_type
            if(user_type_get > 0){
                var result = await mysql.execute(`select 
                schedules.*,
                veterinary.name_user as nm_veterinary,
                pet.nm_animal
                from tbl_schedules as schedules inner join tbl_pets as pet on pet.cd_animal = schedules.cd_animal
                LEFT join tbl_account as veterinary on CASE WHEN schedules.service_type = 1 THEN veterinary.id_user = schedules.cd_veterinary END
                WHERE schedules.cd_schedule = ? and schedules.id_user = ?;`, [ req.params.cd_schedule, req.params.id_user ])
                if (result.length > 0){
                    const response = {
                        Search: result.map(schedules => {
                            return {
                                cd_schedule: parseInt(schedules.cd_schedule),
                                id_user: parseInt(schedules.id_user),
                                date_schedule: EncryptDep.Decrypt(schedules.date_schedule),
                                time_schedule: EncryptDep.Decrypt(schedules.time_schedule),
                                cd_animal: parseInt(schedules.cd_animal),
                                cd_veterinary: parseInt(schedules.cd_veterinary),
                                description: EncryptDep.Decrypt(schedules.description),
                                nm_veterinary: EncryptDep.Decrypt(schedules.nm_veterinary),
                                nm_animal: EncryptDep.Decrypt(schedules.nm_animal),
                                service_type: parseInt(schedules.service_type),
                                delivery: parseInt(schedules.delivery),
                                status: parseInt(schedules.status)
                            }
                        })
                }
            return res.status(200).send(response)
        }else
            return res.status(204).send({ message: 'No Schedule for this user' })
            }else
                return res.status(401).send({message: 'You can not disable customers'})
        }else
            return res.status(401).send({message: 'You can not disable customers'})
    } catch (error) {
        ServerDetails.RegisterServerError("Get Schedule Details", error.toString());
        return res.status(500).send( { error: error } )
    }
}