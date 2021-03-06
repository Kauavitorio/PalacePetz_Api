const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 
const EncryptDep = require('../controllers/encryption')
const Emails = require('./email')

//  Method to show to user your orders
exports.GetAllOrders = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result = await mysql.execute(`select * from tbl_orders where id_user = ?;`, id_user);
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

//  Method to show to user your order detials
exports.GetOrderDetails = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var cd_order = req.params.cd_order
        var result = await mysql.execute(`select * from tbl_orders where id_user = ? and cd_order = ?;`, [id_user, cd_order]);
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

//  Method to show to user your last orders
exports.GetLastOrders = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result = await mysql.execute(`select * from tbl_orders where id_user = ? order by cd_order desc
        limit 1;`, id_user);
        if(result.length > 0){
            const response = {
                cd_order: parseInt(result[0].cd_order),
                id_user: parseInt(result[0].id_user),
                discount: EncryptDep.Decrypt(result[0].discount),
                coupom: EncryptDep.Decrypt(result[0].coupom),
                sub_total: EncryptDep.Decrypt(result[0].sub_total),
                totalPrice: EncryptDep.Decrypt(result[0].totalPrice),
                product_amount: 0,
                date_order: EncryptDep.Decrypt(result[0].date_order),
                cd_card: parseInt(result[0].cd_card),
                status: EncryptDep.Decrypt(result[0].status),
                deliveryTime: result[0].deliveryTime,
                payment: EncryptDep.Decrypt(result[0].number_card)
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
        var status = "Aguardando Aprova????o"
        var number_card;
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

            //  Get Number Card
            var result_card = await mysql.execute('SELECT number_card FROM tbl_cards WHERE id_user = ? and cd_card = ?;', [id_user, cd_card])
            number_card = EncryptDep.Decrypt(result_card[0].number_card)

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
                totalPrice, date_order, cd_card, number_card, status, deliveryTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id_user, EncryptDep.Encrypto(discount), EncryptDep.Encrypto(coupom), EncryptDep.Encrypto(sub_total), EncryptDep.Encrypto(totalPrice), EncryptDep.Encrypto(order_date), cd_card, EncryptDep.Encrypto(number_card), EncryptDep.Encrypto(status), deliveryTime])

            var order_id = insert_order.insertId
            for(let i = 0; i < cd_products_cart.length; i++){
                var result_prod_search = await mysql.execute('SELECT * FROM tbl_products WHERE cd_prod = ?', cd_products_cart[i])
                if(result_prod_search.length > 0)
                    this.Insert_Order_Items(order_id, id_user, cd_products_cart[i], prod_amount[i], result_prod_search[0].product_price)
            }

            /* Clear Table Shooping Cart */
            await mysql.execute(`DELETE FROM tbl_shoppingCart WHERE id_user = ?`, id_user) 

            Emails.SendOrderConfirmation(user_email, name_user, order_id, order_date, sub_total, discount, totalPrice, address_user, complement, user_zipcode)
            
            this.CheckToTryPopularProduct()

            res.status(201).send({message: 'Order sucessfully created'})
        }else{
            return res.status(401).send({ message: "User not exist" });
        }
    /*
    Aguardando Aprova????o
    Preparando Produto
    A caminho
    Entregue
    Conclu??do
    */
    } catch (error) {
        ServerDetails.RegisterServerError("Finish Order", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method to insert order product in list
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

//  Method to put product popular
exports.CheckToTryPopularProduct = async () =>{
    try {
        var Order_Products = []
        var Order_Amount = []
        var result_Orders = await mysql.execute('SELECT * FROM tbl_orders_items;')
        for (let i = 0; i < result_Orders.length; i ++){
            if(!Order_Products.includes(result_Orders[i].cd_prod))
                Order_Products.push(result_Orders[i].cd_prod)
        }

        for (let i = 0; i < Order_Products.length; i++){
            var result_amount = await mysql.execute('select count(*) AS count from tbl_orders_items where cd_prod = ?;', Order_Products[i])
            Order_Amount.push(result_amount[0].count)
        }

        for (let i = 0; i < Order_Products.length; i ++){
            if(Order_Amount[i] >= 5)
                await mysql.execute('UPDATE tbl_products set popular = 1 WHERE cd_prod = ?', Order_Products[i])
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Check To Popular", error.toString());
    }
}