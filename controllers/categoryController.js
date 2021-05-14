const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 

//  Method for Register new Category
exports.RegisterCategory = async (req, res, next) => {
    try{
        var nm_category = req.body.nm_category;
        var img_category = req.body.img_category;
        var query = `SELECT * FROM tbl_category WHERE nm_category = ?`
        var result  = await mysql.execute(query, nm_category.toLowerCase())
        if(result.length > 0){
            return res.status(409).send({ message: 'Category already registered' })
        }else{
            query = `INSERT INTO tbl_category(nm_category, img_category) VALUES (?, ?) `
            var results = await mysql.execute(query, [nm_category, img_category])
            var response = {
                message: 'Category successfully registered',
                cd_category: results.insertId,
                nm_category: nm_category,
                img_category: img_category
            }
            return res.status(201).send(response)
        }
    }catch(error){
        ServerDetails.RegisterServerError("Register Category", error.toString())
        return res.status(500).send( { error: error } )
    }
}

// Method for List Category
exports.ListCategory = async(req, res, next) => {
    try {
        var result = await mysql.execute(`SELECT * FROM tbl_category`);
        if(result.length > 0){
            const response = {
                Search: result.map(category => {
                    return {
                        cd_category: category.cd_category,
                        nm_category: category.nm_category,
                        img_category: category.img_category
                    }
                })
            }
            return res.status(200).send(response);
        } else{
            return res.status(204).send("No category registred")
        }
    } catch (error) {
        ServerDetails.RegisterServerError("List Category", error.toString())
        return res.status(500).send( { error: error } )
    }
}