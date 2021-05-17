-- MySQL DataBase For PalacePetz
-- Generated: 2021-04-30 15:20
-- Model: PalacePetz
-- Version: 1.2
-- Project: Sync with restAPI by SystemStrength
-- Author: SystemStrength

/****** Commands below should only be used in direct connection to the api  ******/
-- drop database heroku_7b1399765cd2afd;

-- create database `heroku_7b1399765cd2afd`  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;
use heroku_7b1399765cd2afd;

/******	To test local use the commands below ******/
drop database `db_palacepetz`;
create database `db_palacepetz` DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;
use db_palacepetz;
/**************************************************/

--	Table for Account
 drop table tbl_account;
create table tbl_account(
    id_user int primary key auto_increment,
    name_user varchar(600) not null,
    email varchar(600) not null,
    cpf_user varchar(600) not null,
    address_user varchar(600),
    complement varchar(600),
    zipcode varchar(600),
    phone_user varchar(600),
    birth_date varchar(600),
    user_type int default 0,
    img_user varchar(600),
    password varchar(600) not null,
    verify_id varchar(200) not null,
    verify int default 0
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

--  Table for Products
-- drop table tbl_products;
CREATE TABLE tbl_products(
    cd_prod int PRIMARY KEY AUTO_INCREMENT,
    cd_category int not null, FOREIGN KEY (cd_category) REFERENCES tbl_category (cd_category),
    nm_product VARCHAR(200) not null,
    amount int not null,
    species VARCHAR(100),
    product_price DECIMAL(10, 2) not null,
    description VARCHAR(200) not null,
    date_prod VARCHAR(200) not null,
    shelf_life VARCHAR(10) not null,
    image_prod VARCHAR(300) not null,
    popular int not null default 0
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
alter table tbl_products auto_increment=149;

--  Table for Categorys
create table tbl_category(
    cd_category int primary key auto_increment,
    nm_category varchar(50) not null,
    img_category varchar(250)
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

--	Table for Cards
 drop table tbl_cards;
SELECT * FROM tbl_cards WHERE id_user = ?;
create table tbl_cards(
    cd_card int primary key auto_increment,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user), 
    flag_card varchar(500) not null,
    number_card varchar(500) not null,
    shelflife_card varchar(500) not null,
    cvv_card varchar(500) not null,
    nmUser_card varchar(500) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

/*	Table for Server Details  */
create table tbl_serverDetails(
    id_details int PRIMARY KEY auto_increment,
    Local varchar(50) not null,
    date varchar(10) not null,
    time varchar(5) not null,
    Description varchar(500)
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

/* Table for be used in mobile */
create table tbl_versionMobile(
	cd_version int primary key auto_increment,
    versionName varchar(10) not null,
    versionCode int not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
update tbl_versionMobile set versionName = "1.2", versionCode = 3 where cd_version = 4;
select * from tbl_versionMobile;

-- Selects
select * from tbl_account;
select * from tbl_products;
update tbl_products set amount = 0 where cd_prod = 154;
select * from tbl_category;
select * from tbl_cards;
select * from tbl_serverDetails;