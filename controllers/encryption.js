var CryptoJS = require("crypto-js");
const CRYPTKEY = process.env.JWT_KEY;

// Decrypt
exports.Decrypt = (EncryText) => {
    if(EncryText == null || EncryText == "" || EncryText == " "){
        return null;
    }else{
        let decData = CryptoJS.enc.Base64.parse(EncryText).toString(CryptoJS.enc.Utf8)
        let bytes = CryptoJS.AES.decrypt(decData, CRYPTKEY).toString(CryptoJS.enc.Utf8)
        return JSON.parse(bytes)
    }
}

// Encrypto
exports.Encrypto = (OriginalText) => {
    let encJson = CryptoJS.AES.encrypt(JSON.stringify(OriginalText), CRYPTKEY).toString()
    let encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson))
    return encData
}