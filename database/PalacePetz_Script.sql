-- MySQL DataBase For PalacePetz
-- Generated: 2021-04-30 15:20
-- Model: PalacePetz
-- Version: 1.2
-- Project: Sync with restAPI by SystemStrength
-- Author: SystemStrength

/****** Commands below should only be used in direct connection to the api  ******/
-- drop database ;

-- create database ``  DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;

/******	To test local use the commands below ******/
drop database `db_palacepetz`;
create database `db_palacepetz` DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci ;
use db_palacepetz;
/**************************************************/

--	Table for Account
drop table tbl_account;
create table tbl_account(
    id_user int primary key auto_increment,
    name_user varchar(356) not null,
    email varchar(256) not null,
    cpf_user varchar(600) not null,
    address_user varchar(600) default "null",
    complement varchar(600) default "null",
    zipcode varchar(600) default "null",
    phone_user varchar(600) default "null",
    user_type int default 0,
    img_user varchar(300),
    password varchar(356) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

/*	Table for Server Details  */
create table tbl_serverDetails(
    id_details int PRIMARY KEY auto_increment,
    Local varchar(50) not null,
    date varchar(10) not null,
    time varchar(5) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

-- Selects
select * from tbl_account;
select * from tbl_serverDetails;