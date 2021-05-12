const mysql = require('../mysql')
const ServerDetails = require('../ServerError') 
const BadWords = require('../controllers/badWords')
var requestId = 0;

//  Method for Register new product
exports.RegisterNewProduct = async (req, res, next) => {
    var cd_category = req.body.cd_category
    var nm_product = req.body.nm_product
    var amount = req.body.amount
    var species = req.body.species
    var product_price = req.body.product_price
    var shelf_life = req.body.shelf_life
    var description = req.body.description
    var image_prod = req.body.image_prod
    showRequestId()
    try {

        /* Get current date */
        let data = new Date();
        var dataFormat = data.toISOString().substring(0, 10);
        var queryCat = `SELECT * FROM tbl_category WHERE cd_category = ?`
        var resultCat = await mysql.execute(queryCat, cd_category)
        if(resultCat.length > 0){
            if(amount == null || amount.length <= 0){
                return res.status(507).send({ message: `Amount cannot be null` })
            }else{
                if(shelf_life == null || shelf_life.length <= 0)
                    return res.status(507).send({ message: `Shelf Life cannot be null` })
                else{
                    if(BadWords.VerifyUsername(nm_product))
                        return res.status(507).send({ message: `Product name not allowed.` })
                    else{
                        var queryProd = `SELECT nm_product FROM tbl_products WHERE nm_product = ?;`
                        var resultProd = await mysql.execute(queryProd, nm_product)
                        if(resultProd.length > 0)
                        return res.status(409).send({message: `Product is registred.`})
                        else{
                            var query = `INSERT INTO tbl_products (cd_category, nm_product, amount, species, product_price, description, date_prod, shelf_life, image_prod)
                            VALUES (?,?,?,?,?,?,?,?,?)`
                            var result = await mysql.execute(query, [ cd_category, nm_product, amount, species, product_price, description, dataFormat, shelf_life, image_prod ])
                            const response = {
                                message: 'Product was Successfully inserted',
                                cd_prod: result.insertId,
                                nm_product: nm_product,
                                amount: amount,
                                species: species,
                                product_price: product_price
                            } 
                            return res.status(201).send(response)
                        }
                    }
                }
            }    
        }else{
            return res.status(501).send({ message: `Category does not match` })
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Register Product", error.toString());
        return res.status(500).send({ error: error})
    }
}

function showRequestId(){
    requestId++;
    console.log("---------------------\n-- ✅ Request Id: " + requestId + "\n---------------------")
}