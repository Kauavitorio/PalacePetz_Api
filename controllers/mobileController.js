const mysql = require('../mysql')
const ServerDetails = require('../ServerInfo') 

exports.GetMobileVersion = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        var result = await mysql.execute('select * from tbl_versionMobile;')
        if(result.length > 0){
            return res.status(200).send({
                cd_version: result[0].cd_version,
                versionName: result[0].versionName,
                versionCode: result[0].versionCode
            })
        }else{
            return res.status(204).send({ message: 'No version on database' })
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Get Mobile Version", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}