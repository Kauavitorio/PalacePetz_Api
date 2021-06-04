const mysql = require('./mysql')

exports.RegisterServerError = async (ErrorLocal, Description) => {
    try {
        var date = GetDate();
        var time = GetTime();
        var query = `insert into tbl_serverDetails (Local, date, time, Description) values (?,?,?,?);`
        await mysql.execute(query, [ ErrorLocal, date, time, Description ])
        console.log('Server error successfully inserted')
    } catch (error) {
        console.log('Error to insert server Error: ' + error)
    }
}

function GetDate(){
    var date = new Date()
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var formatterDay;	
    if (day < 10) {
    formatterDay = '0'+ day;
    } else {
    formatterDay = day;
    }
    var formatterMonth;	
    if (month < 10) {
        formatterMonth = '0'+ month;
    } else {
    formatterMonth = month;
    }
    return formatterDay +'/'+ formatterMonth +'/'+ year;
}

exports.GetDate = () => {
    var date = new Date()
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var formatterDay;	
    if (day < 10) {
    formatterDay = '0'+ day;
    } else {
    formatterDay = day;
    }
    var formatterMonth;	
    if (month < 10) {
        formatterMonth = '0'+ month;
    } else {
    formatterMonth = month;
    }
    return formatterDay +'/'+ formatterMonth +'/'+ year;
}

function GetTime(){
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    return hour + ":" + min;
}

exports.GetTime = () => {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    return hour + ":" + min;
}

//  Method to print on console the Request Id
var requestId = 0;
exports.showRequestId = () => {
    requestId++;
    var getdate = GetDate() + " • " + GetTime();
    if(requestId.toString().length == 1)
        console.log("----------------------------------------------------\n------ ✅ Request Id: " 
        + requestId + ` ${getdate} ✅ ------\n----------------------------------------------------`)
    else if (requestId.toString().length == 2)
        console.log("-----------------------------------------------------\n------ ✅ Request Id: " 
        + requestId + ` ${getdate} ✅ ------\n-----------------------------------------------------`)
    else if (requestId.toString().length == 3)
        console.log("------------------------------------------------------\n------ ✅ Request Id: " 
        + requestId + ` ${getdate} ✅ ------\n------------------------------------------------------`)
    else
        console.log("-------------------------------------------------------\n------ ✅ Request Id: " 
        + requestId + ` ${getdate} ✅ ------\n-------------------------------------------------------`)
}