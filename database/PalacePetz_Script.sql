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
create table tbl_account(
    id_user int primary key auto_increment,
    name_user varchar(100) not null,
    email varchar(256) not null,
    cpf_user char(14) not null,
    address_user varchar(300),
    complement varchar(100),
    zipcode varchar(9),
    phone_user char(15),
    user_type int default 0,
    img_user varchar(300),
    password varchar(356) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

-- Selects
select * from tbl_account;
