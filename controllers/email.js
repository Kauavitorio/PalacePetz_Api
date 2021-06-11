var nodemailer = require('nodemailer')
var handlebars = require('handlebars');
var fs = require('fs');
var EmailTemplate = require('email-templates').EmailTemplate

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'palacepetz.shop@gmail.com',
        pass: '@palacepetzshopsystem'
    }
});

//  Method to send email confirmation to user
exports.SendEmailConfirmation = ($recipient, $username, $url_toConfirm) => {

    //  Create HTML reader
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    readHTMLFile(__dirname + '/templates/confirmEmail.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            username: $username,
            url_confirm: $url_toConfirm
        };
        //  Set email template
        var htmlToSend = template(replacements);
        //  Create email formart
        var mailOptions = {
        from: '"Palace Petz" <palacepetz.shop@gmail.com>',
        to: $recipient,
        subject: 'Confirmação de e-mail!',
        html : htmlToSend
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return "Error";
        } else {
            console.log('Email sent: ' + info.response);
            return "Sent";
        }
    });
    });
}

//  Method to send passoword reset
exports.SendPasswordReset = ($recipient, $reset_link) => {

    //  Create HTML reader
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    readHTMLFile(__dirname + '/templates/resetpassword.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            reset_link: $reset_link
        };

        //  Set email template
        var htmlToSend = template(replacements);
        //  Create email formart
        var mailOptions = {
        from: '"Palace Petz" <palacepetz.shop@gmail.com>',
        to: $recipient,
        subject: 'Redefinição de senha!',
        html : htmlToSend
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return "Error";
        } else {
            console.log('Passoword reset Email sent: ' + info.response);
            return "Sent";
        }
    });
    });
}

//  Method to send order confirmation
exports.SendOrderConfirmation = ($recipient, $name_user, $order_id, $order_date, $sub_total, $discount, $order_total,
    $address_user, $complement, $zipcode) => {

    //  Create HTML reader
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    readHTMLFile(__dirname + '/templates/orderconfirmation.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            order_id: $order_id,
            name_user: $name_user,
            order_date: $order_date,
            sub_total: $sub_total,
            discount: $discount,
            order_id: $order_id,
            order_total: $order_total,
            address_user: $address_user,
            complement: $complement,
            zipcode: $zipcode
        };

        //  Set email template
        var htmlToSend = template(replacements);
        //  Create email formart
        var mailOptions = {
        from: '"Palace Petz" <palacepetz.shop@gmail.com>',
        to: $recipient,
        subject: 'Pedido #' + $order_id,
        html : htmlToSend
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return "Error";
        } else {
            console.log('Confirm Order Email sent: ' + info.response);
            return "Sent";
        }
    });
    });
}
//  Method to send Password has change
exports.SendPasswordHasChange = ($recipient, $nm_user, $user_id) => {

    //  Create HTML reader
    var readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };
    readHTMLFile(__dirname + '/templates/passwordhaschange.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            recipient: $recipient,
            nm_user: $nm_user,
            user_id: $user_id
        };

        //  Set email template
        var htmlToSend = template(replacements);
        //  Create email formart
        var mailOptions = {
        from: '"Palace Petz" <palacepetz.shop@gmail.com>',
        to: $recipient,
        subject: 'Sua senha da PalacePetz foi alterada',
        html : htmlToSend
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return "Error";
        } else {
            console.log('Confirm Order Email sent: ' + info.response);
            return "Sent";
        }
    });
    });
}