const mysql = require('../mysql')
const ServerDetails = require('../ServerError') 

//  Method for Register new product
exports.RegisterNewProduct = async (req, res, next) => {
    var cd_prod = 0; 
    var cd_stock = 0;
    var cd_category = req.body.cd_category
    var nm_product = req.body.nm_product;
    var product_price = req.body.product_price
    var description = req.body.description
    var image_prod = req.body.image_prod;
    var amount = req.body.amount;
    var amount_stock = req.body.amount_stock;
    try{
        if (amount > amount_stock) {
            return res.status(406).send({ message: 'Product quantity cannot be greater than the quantity that will be available in stock' })
        }else{
            /*-------------------- Insert new product ---------------------------*/
            var queryVerify = `SELECT * FROM tbl_products WHERE nm_product = ?;`
            var resultVerify = await mysql.execute(queryVerify, nm_product);
            if(resultVerify.length <= 0){
                var queryinsertProduct = `INSERT INTO tbl_products(cd_category, nm_product, product_price, description, image_prod, amount) VALUES(?, ?, ?, ?, ?, ?)`;
                var resultInsert = await mysql.execute(queryinsertProduct, [cd_category, nm_product, product_price, description, image_prod, amount])
                /*-------------------- Insert product stock ---------------------------*/
                cd_prod = resultInsert.insertId
                var queryInsertStock = `INSERT INTO tbl_stock (cd_prod, amount_stock) VALUES (?,?)`
                var resultInsertStock = await mysql.execute(queryInsertStock, [cd_prod, amount_stock])
                cd_stock = resultInsertStock.insertId
                /*-------------------- Insert cd_stock on product ---------------------------*/
                var queryUpdateProduct = `UPDATE tbl_products SET cd_stock = ? WHERE cd_prod = ?` 
                await mysql.execute(queryUpdateProduct, [cd_stock, cd_prod])
                const response = {
                    message: 'Product successfully inserted',
                    cd_prod: cd_prod,
                    cd_stock: cd_stock,
                    amount_stock: amount_stock
                }
                return res.status(201).send(response)
            }else{
                return res.status(409).send({ message: 'Product alredy registred' })
            }   
        }
    }catch(error){
        ServerDetails.RegisterServerError("Register Product", error.toString());
        return res.status(500).send({ error: error})
    }
}