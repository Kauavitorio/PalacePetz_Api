//const mysql = require('./mysql')
const bcrypt = require('bcrypt');

exports.TestPassword = async (req, res, next) => {
    try{
        const plainTextPassword1 = req.body.password;
        const hash = await bcrypt.hashSync(plainTextPassword1, 13);
        res.status(200).send( { Hash: hash
        } )
    }catch{

    }
}

exports.TestTimeToHash = async (req, res, next) => {
    try{
        const plainTextPassword1 = req.body.password;
        for (let saltRounds = 10; saltRounds < 21; saltRounds++) {
        console.time(`bcrypt | cost: ${saltRounds}, time to hash`);
        bcrypt.hashSync(plainTextPassword1, saltRounds);
        console.timeEnd(`bcrypt | cost: ${saltRounds}, time to hash`);
        }
        const hash = await bcrypt.hashSync(plainTextPassword1, 13);
        res.status(200).send( { Hash: hash,
        NewCode: saltRounds     
        } )
    }catch{

    }
}