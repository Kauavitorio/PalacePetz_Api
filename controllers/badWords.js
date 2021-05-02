exports.VerifyUsername = (Username) => {
    var FullName = Username.toLowerCase().split(" ");
    var NameList = [];
    NameList.push(FullName[0])
    NameList.push(FullName[1])
    var BadWords = ["porra", "buceta", "anus", "baba-ovo", "babaovo", "babaca", "bacura", "bagos", "baitola", "bebum", "besta", "bicha", "bisca", "bixa", "boazuda", "boceta", "boco", "boiola", "bolagato", "boquete", "bolcat", "bosseta", "bosta", "bostana", "brecha", "brexa", "brioco", "bronha", "buca", "bunda", "bunduda", "burra", "busseta", "cachorra", "cachorro", "cadela", "caga", "cagado", "cagao", "cagao", "chochota", "chota", "chibumba", "chupada", "chupado", "clitoris", "cocaina", "coco", "corna", "corno", "cu", "curalho", "debil", "debiloide", "defunto", "demonio", "difunto", "egua", "escrota", "fedido", "foda", "fudecao", "homo-sexual", "homossexual", "idiota", "iscroto", "imbecil", "idiotice", "app", "ladrao", "macaco", "machona", "machorra", "mijada", "otaria", "otario", "pau", "pênis", "penis", "Pica", "picao", "puta", "safado", "siririca", "tezao", "xota", "xana", "víado", "viado", "viadao", "vagina", "xaninha", "vagabunda", "vagabundo", "troxa", "trouxa", "caralho", "fuck", "dick", "panaca", "pika", "crackudo", "jamanta", "piroka", "viruto", "fuder", "vai", "vai se fuder", "comeuseucu", "takuku navara", "takukunavara", "não paro", "nao", "não", "kikulindo", "kiku lindo", "quicu lindo"]
    var BadWordsList = []
    for(var i = 0; i < NameList.length; i++){
        if(BadWords.includes(NameList[i])){
            BadWordsList.push(BadWords)
        }
    }
    if(BadWordsList.length > 0){
        return true;
    }else{
        return false;
    }
}