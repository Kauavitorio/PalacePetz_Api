const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 
const EncryptDep = require('../controllers/encryption')
const Emails = require('./email')

//  Method to show to user ours orders
exports.GetAllOrders = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result = await mysql.execute(`select 
		order_user.cd_order,
		order_user.id_user,
		order_user.discount,
		order_user.coupom,
		order_user.sub_total,
		order_user.totalPrice,
		order_user.date_order,
		order_user.cd_card,
		order_user.status,
		order_user.deliveryTime,
		card.number_card
        from tbl_orders  as order_user inner join tbl_cards as card
        on card.cd_card = order_user.cd_card WHERE order_user.id_user = ?;`, id_user);
        if(result.length > 0){
            const response = {
                Search: result.map(orders => {
                    return {
                        cd_order: parseInt(orders.cd_order),
                        id_user: parseInt(orders.id_user),
                        discount: EncryptDep.Decrypt(orders.discount),
                        coupom: EncryptDep.Decrypt(orders.coupom),
                        sub_total: EncryptDep.Decrypt(orders.sub_total),
                        totalPrice: EncryptDep.Decrypt(orders.totalPrice),
                        product_amount: 0,
                        date_order: EncryptDep.Decrypt(orders.date_order),
                        cd_card: parseInt(orders.cd_card),
                        status: EncryptDep.Decrypt(orders.status),
                        deliveryTime: orders.deliveryTime,
                        payment: EncryptDep.Decrypt(orders.number_card)
                    }
                })
                }
            return res.status(200).send(response)
        }else
            return res.status(404).send( { message: 'No orders for this user' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Get Order", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method for finish user purchase
exports.FinishOrder = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var id_user = req.body.id_user
        var address_user;  
        var complement;
        var user_email;
        var name_user;
        var user_zipcode;
        var cd_card = req.body.cd_card
        var discount = req.body.discount
        var coupom = req.body.coupom
        var sub_total = req.body.sub_total
        var totalPrice = req.body.totalPrice
        var order_date = ServerDetails.GetDate()
        var status = "Aguardando aprovação"
        var deliveryTime = 45
        var procentDiscount;

        /* Get user cpf */
        var result_first_info = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_first_info.length > 0){
            name_user = EncryptDep.Decrypt(result_first_info[0].name_user)
            address_user = EncryptDep.Decrypt(result_first_info[0].address_user)
            user_email = EncryptDep.Decrypt(result_first_info[0].email)
            complement = EncryptDep.Decrypt(result_first_info[0].complement)
            user_zipcode = EncryptDep.Decrypt(result_first_info[0].zipcode)

            /* Get products cart */ 
            var cd_products_cart = []
            var prod_amount = []
            var result_user_cart = await mysql.execute('SELECT * FROM tbl_shoppingCart WHERE id_user = ?', id_user)
            for(let i = 0; i < result_user_cart.length; i++){
                cd_products_cart.push(result_user_cart[i].cd_prod)
                prod_amount.push(result_user_cart[i].product_amount)
                this.DropStock(result_user_cart[i].cd_prod, parseInt(result_user_cart[i].product_amount))
            }

            if(coupom != null && coupom != "" && coupom != " "){
                var result_discount = await mysql.execute('SELECT * FROM tbl_discounts WHERE name_tag = ?', coupom)
                procentDiscount = result_discount[0].discount_total
                discount = discount + " - " + procentDiscount+ "%"
            }

            /* Insert Order */
            var insert_order = await mysql.execute(`INSERT INTO tbl_orders (id_user, discount, coupom, sub_total,
                totalPrice, date_order, cd_card, status, deliveryTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id_user, EncryptDep.Encrypto(discount), EncryptDep.Encrypto(coupom), EncryptDep.Encrypto(sub_total), EncryptDep.Encrypto(totalPrice), EncryptDep.Encrypto(order_date), cd_card, EncryptDep.Encrypto(status), deliveryTime])

            var order_id = insert_order.insertId
            for(let i = 0; i < cd_products_cart.length; i++){
                var result_prod_search = await mysql.execute('SELECT * FROM tbl_products WHERE cd_prod = ?', cd_products_cart[i])
                if(result_prod_search.length > 0){
                    this.Insert_Order_Items(order_id, id_user, cd_products_cart[i], prod_amount[i], result_prod_search[0].product_price)
                }
            }

            /* Clear Table Shooping Cart */
            await mysql.execute(`DELETE FROM tbl_shoppingCart WHERE id_user = ?`, id_user) 

            Emails.SendOrderConfirmation(user_email, name_user, order_id, order_date, sub_total, discount, totalPrice, address_user, complement, user_zipcode)
            
            res.status(201).send({message: 'Order sucessfully created'})
        }else{
            return res.status(401).send({ message: "User not exist" });
        }
    /*
    Aguardando aprovação
    Preparando produto
    A caminho
    Entregue
    Concluido
    */
    } catch (error) {
        ServerDetails.RegisterServerError("Finish Order", error.toString());
        return res.status(500).send({ error: error})
    }
}

exports.Insert_Order_Items = async (order_id, id_user, cd_prod, prod_amount, prod_price) => {
    await mysql.execute(`INSERT INTO tbl_orders_items (cd_order, id_user, cd_prod, product_amount, product_price)
    VALUES (?, ?, ?, ?, ?)`, [order_id, id_user, cd_prod, prod_amount, prod_price])
}

//  Method to remove products stock
exports.DropStock = async (cd_prod, amount) => {
    var resultProd = await mysql.execute('SELECT * FROM tbl_products WHERE cd_prod = ?', parseInt(cd_prod))
    var result_stock = parseInt(resultProd[0].amount)
    var dropStock;
    if(result_stock < amount)
        dropStock = 0
    else
        dropStock =  result_stock - amount;

    await mysql.execute('UPDATE tbl_products SET amount = ? where cd_prod = ?', [dropStock, parseInt(cd_prod)])
}