const mysql = require('../mysql')
const EncryptDep = require('../controllers/encryption')
const ServerDetails = require('../ServerInfo')

exports.    InsertUserCart = async (req, res, next) => {
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
                            id_user: parseInt(cart.id_user),
                            product_price: parseFloat(cart.product_price),
                            totalPrice: parseFloat(cart.totalPrice),
                            product_amount: parseInt(cart.product_amount),
                            sub_total: parseFloat(cart.sub_total)
                        }
                    })
                    }
                return res.status(200).send(response)
            }else
            return res.status(204).send( { message: 'Nothing on user cart' } )
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