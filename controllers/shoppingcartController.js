const mysql = require('../mysql')
const EncryptDep = require('../controllers/encryption')
const ServerDetails = require('../ServerInfo')

exports.InsertUserCart = async (req, res, next) => {
    try {
        var id_user = req.body.id_user
        var cd_prod = req.body.cd_prod
        var result_USER = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_USER.length > 0){
            var results_Cart = await mysql.execute('SELECT * FROM tbl_shoppingCart WHERE id_user = ? and cd_prod = ?;', [ id_user, cd_prod])
            if(results_Cart.length > 0){
                return res.status(409).send({error: 'Just have this product on your cart'})
            }else{
                //  Insert products on user cart
                const query = 'INSERT INTO tbl_shoppingCart(cd_prod, id_user, product_price, totalPrice, product_amount, sub_total) VALUES (?,?,?,?,?,?)'
                const result = await mysql.execute(query, [ cd_prod, id_user, req.body.product_price, req.body.totalPrice, req.body.product_amount,
                    req.body.sub_total ])
                return res.status(201).send({
                    cd_cart: result.insertId,
                    product_price: req.body.product_price,
                    totalPrice: req.body.totalPrice,
                    product_amount: req.body.product_amount
                });
            }
        }else
            return res.status(404).send( { message: 'User not registered' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Insert Cart user", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

exports.GetCartUser = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result_USER = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_USER.length > 0){
            var results = await mysql.execute(`select 
            cart.cd_cart,
            cart.cd_prod,
            prod.nm_product,
            prod.image_prod,
            prod.amount,
            cart.id_user,
            cart.product_price,
            cart.totalPrice,
            cart.product_amount,
            cart.sub_total
            from tbl_shoppingCart as cart inner join tbl_products as prod
            on cart.cd_prod = prod.cd_prod where id_user = ?;`, id_user)
            if(results.length > 0){
                const response = {
                    Search: results.map(cart => {
                        return {
                            cd_cart: parseInt(cart.cd_cart),
                            cd_prod: parseInt(cart.cd_prod),
                            nm_product: cart.nm_product,
                            image_prod: cart.image_prod,
                            amount: parseInt(cart.amount),
                            id_user: parseInt(cart.id_user),
                            product_price: cart.product_price,
                            totalPrice: cart.totalPrice,
                            product_amount: cart.product_amount,
                            sub_total: cart.sub_total
                        }
                    })
                    }
                return res.status(200).send(response)
            }else{
                const response = {
                    Search: results.map(cart => {
                        return {
                            cd_cart: 0,
                            cd_prod: 0,
                            nm_product: "Nenhum Produto em sue carrinho",
                            image_prod: "https://media.discordapp.net/attachments/707671310104526863/846488817367384144/unnamed-removebg-preview.png?width=467&height=467",
                            amount: 0,
                            id_user: 0,
                            product_price: 0,
                            totalPrice: 0,
                            product_amount: 0,
                            sub_total: 0
                        }
                    })
                    }
                return res.status(206).send(response)
            }
        }else
            return res.status(404).send( { message: 'User not registered' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Get Cart User", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

exports.GetCartSize = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result_USER = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_USER.length > 0){
            var results = await mysql.execute('SELECT * FROM tbl_shoppingCart WHERE id_user = ?', id_user)
            return res.status(200).send({ length: results.length })
        }
        else
            return res.status(404).send( { message: 'User not registered' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Get Cart User", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

exports.UpdateCartToNewAmount = async (req, res, next) => {
    try {
        //  Verify if have same product on user cart
        const queryHave = 'SELECT * FROM tbl_shoppingCart WHERE id_user = ? and cd_prod = ?;'
        const resultHaveOnCart = await mysql.execute(queryHave, [req.params.id_user, req.params.cd_prod])
        if(resultHaveOnCart.length > 0){
            const query = `UPDATE tbl_shoppingCart SET product_amount = ?, totalPrice = ?, sub_total = ?
                                                                WHERE id_user = ? and cd_prod = ? `
        await mysql.execute(query, [  req.params.product_amount, req.params.totalPrice, req.params.sub_total, req.params.id_user, req.params.cd_prod ])
        const response = {
            mensagem: 'Cart updated successfully !!',
            productsUpdated: {
                email_user: req.params.email_user,
                cd_prod: req.params.cd_prod,
                full_price_prod: req.params.full_price_prod,
            }
        }
        return res.status(202).send(response);
        }else{
            return res.status(417).send({warning: 'User don`t have this product on cart'})
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Update Cart", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

exports.RemoveItemFromCart = async (req, res, next) => {
    try {
        ServerDetails.showRequestId();
        //  Verify if have same product on user cart
        const queryHave = 'SELECT * FROM tbl_shoppingCart WHERE id_user = ? and cd_prod = ?;'
        const resultHaveOnCart = await mysql.execute(queryHave, [req.params.id_user, req.params.cd_prod])
        if(resultHaveOnCart.length > 0){
            const query = `delete from tbl_shoppingcart where id_user = ? and cd_prod = ?;`
        await mysql.execute(query, [  req.params.id_user, req.params.cd_prod ])
        const response = {
            mensagem: 'Product successfully removed!!'}
        return res.status(200).send(response);
        }else{
            return res.status(417).send({warning: 'User don`t have this product on cart'})
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Remove Item From Cart", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}