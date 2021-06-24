const mysql = require('../mysql')
const EncryptDep = require('./encryption')
const Server = require('../ServerInfo') 

exports.GetAllSchedules = async (req, res, next) => {
    try {
        var id_user = req.params.id_user 
        var result = await mysql.execute(`CALL spSelect_Schedules(?);`, id_user)
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
    } catch (error) {
        Server.RegisterServerError("Get Schedules", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

exports.CancelSchedule = async (req, res, next)=> {
    try {
        var id_user = req.params.id_user
        var cd_schedule = req.params.cd_schedule
        var description = req.params.description
        
        var select_user = await mysql.execute(`SELECT * FROM tbl_account WHERE id_user = ?`, id_user)
        if (select_user.length > 0) {
            await mysql.execute(`UPDATE tbl_schedules SET status = 2, description = ? WHERE cd_schedule = ?`, [ EncryptDep.Encrypto(description), cd_schedule, ])
            return res.status(200).send({message: 'Canceled with Success!'})
        }else
            return res.status(405).send({ message: 'This user doesnt exist' })

    } catch (error) {
        Server.RegisterServerError("Cancel Schedules", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

//  Method to Create new Schedule  
exports.CreateSchedule = async (req, res, next) => {
    try {
        var date_schedule = req.body.date_schedule
        var time_schedule = req.body.time_schedule
        var cd_animal = req.body.cd_animal
        var nm_veterinary = req.body.cd_veterinary
        var description = req.body.description
        var service_type = req.body.service_type
        var payment = req.body.payment_type
        var delivery = req.body.delivery
        var status = 0
        var id_user = req.body.id_user
        var cd_veterinary;

        var result_select = await mysql.execute(`SELECT * FROM tbl_account WHERE id_user = ?;`, id_user)

        if(result_select.length > 0){
            
            if(!Number.isInteger(cd_animal)){
                var result_selectPet = await mysql.execute(`SELECT nm_animal, cd_animal FROM tbl_pets WHERE id_user = ?;`, id_user)
                for(let i = 0; i < result_selectPet.length; i++){
                    var nm_pet_get = EncryptDep.Decrypt(result_selectPet[i].nm_animal)
                    if(nm_pet_get == cd_animal)
                        cd_animal = result_selectPet[i].cd_animal
                }
            }
            if(!Number.isInteger(nm_veterinary)){
                var result_selectVet = await mysql.execute(`SELECT name_user, id_user FROM tbl_account;`)
                for(let i = 0; i < result_selectVet.length; i++){
                    var nm_user_get = EncryptDep.Decrypt(result_selectVet[i].name_user)
                    if(nm_user_get == nm_veterinary)
                        cd_veterinary = result_selectVet[i].id_user
                }
            }
            var insert_schedule = await mysql.execute(`INSERT INTO tbl_schedules(date_schedule, time_schedule, cd_animal, cd_veterinary, payment_type, description, service_type, delivery, status, id_user) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `, [ EncryptDep.Encrypto(date_schedule), EncryptDep.Encrypto(time_schedule), cd_animal, cd_veterinary, payment, EncryptDep.Encrypto(description), service_type, delivery, status, id_user ])
            const response = {
                message: 'Scheduled performed successfully',
                cd_schedule: insert_schedule.insertId
            }
            return res.status(201).send(response)
        
        } else
            return res.status(204).send({ message: 'This user doesnt exist' })

    } catch (error) {
        Server.RegisterServerError("Create Schedule", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}
