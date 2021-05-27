const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 
const EncryptDep = require('../controllers/encryption')
const BadWords = require('./badWords')

//  Method for register new card
exports.RegisterNewCard = async (req, res, next) => {
    var nmUser_card = req.body.nmUser_card;
    var id_user = req.body.id_user;
    try {
        ServerDetails.showRequestId()
        var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
        var resultUser = await mysql.execute(queryUser, id_user)
        if(resultUser.length > 0){
            var queryCardVerify = `SELECT number_card FROM tbl_cards WHERE id_user = ?;`
            var resultCardVerify = await mysql.execute(queryCardVerify, id_user)
            if(resultCardVerify.length > 0){
                var NumberCardList = [];
                for(var i = 0 ; i < resultCardVerify.length; i++){
                    var number_card = EncryptDep.Decrypt(resultCardVerify[i].number_card);
                        if(number_card == req.body.number_card ){
                            NumberCardList.push(i)
                        }
                    }
            if(NumberCardList.length > 0){
                return res.status(409).send({ message: 'Card already registered' })
            }else{
                if(BadWords.VerifyUsername(nmUser_card)){
                    return res.status(406).send({ error: "Card name not allowed"})                
                }else{
                    const query = `INSERT INTO tbl_cards (id_user, flag_card, number_card, shelflife_card, cvv_card, nmUser_card) VALUES (?,?,?,?,?,?)`
                    var result  = await mysql.execute(query, [ id_user, EncryptDep.Encrypto(req.body.flag_card), EncryptDep.Encrypto(req.body.number_card), EncryptDep.Encrypto(req.body.shelflife_card), EncryptDep.Encrypto(req.body.cvv_card), EncryptDep.Encrypto(nmUser_card) ] )
                    const response = {
                        message: "User created successfully",
                        cd_card: result.insertId
                    }
                    return res.status(201).send(response);
                }
            }
            }else{
                if(BadWords.VerifyUsername(nmUser_card)){
                    return res.status(406).send({ error: "Card name not allowed"})                
                }else{
                    const query = `INSERT INTO tbl_cards (id_user, flag_card, number_card, shelflife_card, cvv_card, nmUser_card) VALUES (?,?,?,?,?,?)`
                    var result  = await mysql.execute(query, [ id_user, EncryptDep.Encrypto(req.body.flag_card), EncryptDep.Encrypto(req.body.number_card), EncryptDep.Encrypto(req.body.shelflife_card), EncryptDep.Encrypto(req.body.cvv_card), EncryptDep.Encrypto(nmUser_card) ] )
                    const response = {
                        message: "User created successfully",
                        cd_card: result.insertId
                    }
                    return res.status(201).send(response);
                }
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Register New Card", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for list user cards
exports.GetUserCards = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var result = await mysql.execute(`SELECT * FROM tbl_cards WHERE id_user = ?`,  [req.params.id_user] )
        if(result.length > 0){
            const responsecard = {
                length: result.length,
                Search: result.map(cards => {
                    return {
                        cd_card: cards.cd_card,
                        flag_card: EncryptDep.Decrypt(cards.flag_card),
                        number_card: EncryptDep.Decrypt(cards.number_card),
                        shelflife_card: EncryptDep.Decrypt(cards.shelflife_card),
                        cvv_card: EncryptDep.Decrypt(cards.cvv_card),
                        nmUser_card: EncryptDep.Decrypt(cards.nmUser_card)
                    }
            })
        }
        return res.status(200).send(responsecard)
        }else{
            return res.status(412).send({ warning: 'This user doesn`t have any card on account' })
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Get User Cards", error);
        return res.status(500).send( { error: error } )
    }
}

//  Method for remove user cards
exports.RemoveUserCard = async (req, res, next) => {
    try {
        ServerDetails.showRequestId();
        //  Verify if have same product on user cart
        const queryHave = 'SELECT * FROM tbl_cards WHERE id_user = ? and cd_card = ?;'
        const resultHaveOnCart = await mysql.execute(queryHave, [req.params.id_user, req.params.cd_card])
        if(resultHaveOnCart.length > 0){
            const query = `delete from tbl_cards where id_user = ? and cd_card = ?;`
        await mysql.execute(query, [  req.params.id_user, req.params.cd_card ])
        const response = {
            mensagem: 'Card successfully removed!!'}
        return res.status(200).send(response);
        }else{
            return res.status(417).send({warning: 'User don`t have this product on cart'})
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Remove user Card", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}