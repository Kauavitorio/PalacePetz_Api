const mysql = require('../mysql')
const EncryptDep = require('./encryption')
const Server = require('../ServerInfo') 
const badWords = require('./badWords')
const bcrypt = require('bcrypt');
const _IMG_DEFAULT = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';

exports.GetEmployeeInformation = async (req, res, next) => {
    try {
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

exports.RegisterEmployee = async (req, res, next) => {
    try {
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
        var verify = 1 // END USER INFORMATION

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
    
                    var result_employee = await mysql.execute('CALL spInsert_Employee(?, ?, ?)', [ result_user.insertId, EncryptDep.Encrypto(number_ctps), EncryptDep.Encrypto(role) ])
                    const response = {
                        message: 'Successfully inserted',
                        id_employee: result_employee.insertId
                    }
                    
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
        var id_user = req.body.id_user // END USER INFORMATION

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
            if(!badWords.VerifyUsername(name_user)){;
                await mysql.execute('UPDATE  tbl_account SET name_user = ? , cpf_user = ? , address_user = ? , complement = ?, zipcode = ?, phone_user = ?,  birth_date = ?, user_type = ?, img_user ? WHERE id_user = ?', [EncryptDep.Encrypto(name_user), EncryptDep.Encrypto(cpf_user), EncryptDep.Encrypto(address_user), EncryptDep.Encrypto(complement), EncryptDep.Encrypto(zipcode), EncryptDep.Encrypto(phone_user), EncryptDep.Encrypto(birth_date), user_type, EncryptDep.Encrypto(img_user), id_user]);

                await mysql.execute('UPDATE tbl_employers SET role = ?, number_ctps = ?', [ result_user.insertId, EncryptDep.Encrypto(number_ctps), EncryptDep.Encrypto(role) ])
                const response = {
                    message: 'Successfully inserted',
                    id_employee: result_employee.insertId
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