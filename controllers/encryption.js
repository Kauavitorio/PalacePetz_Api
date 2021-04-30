var CryptoJS = require("crypto-js");
const CRYPTKEY = process.env.JWT_KEY;

// Decrypt
exports.Decrypt = (EncryText) => {
    var bytes  = CryptoJS.AES.decrypt(EncryText, CRYPTKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
return originalText;
}

// Encrypto
exports.Encrypto = (OriginalText) => {
    var encrypText = CryptoJS.AES.encrypt(OriginalText, CRYPTKEY).toString()
return encrypText;
}