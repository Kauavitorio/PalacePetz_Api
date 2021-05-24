const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 

exports.ApplyDiscount = async (req, res, netx) => {
    try {
        ServerDetails.showRequestId()
        var name_tag = req.params.name_tag;
        var id_user = req.params.id_user;
        var cd_discounts = 0;
        var discount_total;
        var max_uses = 0;
        var used = 0;
        var expiry_date;
        var strData = ServerDetails.GetDate();
        var all_user_cupons;
        var cuponsArray = [];
        var cuponUsed = [];
        var result = await mysql.execute('SELECT * FROM tbl_discounts WHERE name_tag = ?', name_tag);
        if(result.length > 0){
            cd_discounts = result[0].cd_discounts
            discount_total = result[0].discount_total
            max_uses = result[0].max_uses
            used = result[0].used
            expiry_date = result[0].expiry_date
            if(strData < expiry_date ){
                if(used < max_uses){
                    var resultsUser = await mysql.execute('SELECT used_coupons FROM tbl_account WHERE id_user = ?', id_user)
                    if(resultsUser.length > 0){
                        all_user_cupons = resultsUser[0].used_coupons
                        if (all_user_cupons == "no coupons"){
                            if(cuponsArray == null || cuponsArray.length <= 0)
                                cuponsArray.push(cd_discounts)
                                
                            await mysql.execute(`update tbl_account set used_coupons = ? where id_user = ?`, [cuponsArray, id_user])
                            used++
                            await mysql.execute('update tbl_discounts set used = ? where cd_discounts =? ', [ used, cd_discounts])
                            var response = {
                                cd_discounts: cd_discounts,
                                discount_total: discount_total
                            }
                            return res.status(200).send(response)
                        }else{
                            var splitUserCupons = all_user_cupons.split(',')
                            for (let i = 0; i < splitUserCupons.length; i++) {
                                if(splitUserCupons[i] == cd_discounts){
                                    cuponUsed.push(cd_discounts)
                                }
                                else{
                                    cuponsArray.push(splitUserCupons[i])
                                }
                            }
                        }
                        if(cuponUsed.length <= 0){
                            if(cuponsArray == null || cuponsArray.length <= 0)
                                cuponsArray.push(cd_discounts)
                            
                            cuponsArray.push(cd_discounts)
                            await mysql.execute(`update tbl_account set used_coupons = ? where id_user = ?`, [cuponsArray.toString(), id_user])
                            used++
                            await mysql.execute('update tbl_discounts set used = ? where cd_discounts =? ', [ used, cd_discounts])
                            var response = {
                                cd_discounts: cd_discounts,
                                discount_total: discount_total
                            }
                            return res.status(200).send(response)
                        }else
                            return res.status(401).send({ message: 'Coupon already used' })
                    }else
                        return res.status(204).send({ message: 'Cupon not existy' })
                }else
                    return res.status(423).send({ message: 'Cupom is expired max uses' })
            }else
                return res.status(423).send({ message: 'Cupom is expired' })
        }else
            return res.status(204).send({ message: 'Cupon not existy' })
    } catch (error) {
        ServerDetails.RegisterServerError("Apply Cupom", error.toString());
        return res.status(500).send({ error: error})
    }
}