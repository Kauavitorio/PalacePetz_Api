const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 
const BadWords = require('../controllers/badWords')

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
    ServerDetails.showRequestId()
    try {
        /* Get ent date */
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

exports.GetProductDetails = async (req, res, next) => {
    try {
        const products = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category WHERE prod.cd_prod = ?;`, req.params.cd_prod);
        if (products.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                    cd_prod: parseInt(products[0].cd_prod),
                    cd_category: parseInt(products[0].cd_category),
                    nm_category: products[0].nm_category,
                    nm_product: products[0].nm_product,
                    amount: parseInt(products[0].amount),
                    species: products[0].species,
                    product_price: parseFloat(products[0].product_price),
                    description: products[0].description,
                    date_prod: products[0].date_prod,
                    shelf_life: products[0].shelf_life,
                    image_prod: products[0].image_prod,
                    popular: parseInt(products[0].popular)
                }
            return res.status(200).send(response)
            }
    } catch (error) {
        ServerDetails.RegisterServerError("Get Product Details", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List Products
exports.ListAllProducts = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category ORDER BY RAND();`);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List all popular Products
exports.ListAllPopularProducts = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.*,
		cat.nm_category
        from tbl_products as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category WHERE prod.popular = 1 and prod.amount > 0;`);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List Products by cd_category
exports.ListProductsByCategory = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category WHERE prod.cd_category = ?;`, req.params.cd_category);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List Products by species
exports.ListProductsBySpecies = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category WHERE prod.species = ?;`, req.params.species);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List Products by biggest price
exports.ListProductsByBiggestPrice = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category ORDER BY prod.product_price DESC;`);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

//  List Products by lowest price
exports.ListProductsByLowestPrice = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category ORDER BY prod.product_price ASC;`);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}

exports.ListProductsByName = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        const results = await mysql.execute(`select 
		prod.cd_prod,
		prod.cd_category,
		cat.nm_category,
		prod.nm_product,
		prod.amount,
		prod.species,
		prod.product_price,
		prod.species,
		prod.description,
		prod.date_prod,
		prod.shelf_life,
		prod.image_prod,
		prod.popular
        from tbl_products  as prod inner join tbl_category as cat
        on prod.cd_category = cat.cd_category WHERE prod.nm_product like "%${req.params.nm_product}%";`);
        if (results.length <= 0) {
            return res.status(204).send({ message: 'No Products registerd' })
        }else{
            const response = {
                Search: results.map(products => {
                    return {
                        cd_prod: parseInt(products.cd_prod),
                        cd_category: parseInt(products.cd_category),
                        nm_category: products.nm_category,
                        nm_product: products.nm_product,
                        amount: parseInt(products.amount),
                        species: products.species,
                        product_price: parseFloat(products.product_price),
                        description: products.description,
                        date_prod: products.date_prod,
                        shelf_life: products.shelf_life,
                        image_prod: products.image_prod,
                        popular: parseInt(products.popular)
                    }
                })
                }
            return res.status(200).send(response)
            }
    }catch (error){
        ServerDetails.RegisterServerError("List All Products", error.toString())
        return res.status(500).send({error: error})
    }
}