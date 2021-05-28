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
-- drop database `db_palacepetz`;
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
    used_coupons varchar(500) default "no coupons",
    password varchar(600) not null,
    verify_id varchar(200) not null,
    verify int default 0
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
alter table tbl_account add column used_coupons varchar(500) default "no coupons";

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

/* Table for Shopping Cart */
drop table tbl_shoppingCart;
create table tbl_shoppingCart(
    cd_cart int primary key auto_increment,
    cd_prod int not null, FOREIGN KEY (cd_prod) REFERENCES tbl_products (cd_prod), 
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user), 
    product_price varchar(500) not null,
    totalPrice varchar(500) not null,
    product_amount int not null,
    sub_total varchar(500) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

-- Table for Orders
drop table tbl_orders;
create table tbl_orders(
    cd_order int primary key auto_increment,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    cpf_user varchar(600) not null,
    discount varchar(500),
    coupom varchar(500),
    sub_total varchar(500) not null,
    totalPrice varchar(500) not null,
    product_amount int not null,
    order_products varchar(500) not null,
    date_order varchar(500) not null,
    cd_card int not null,
    status varchar(500) not null    
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
ALTER TABLE tbl_orders auto_increment = 26542;

-- Table for products historic
drop table tbl_product_historic;
create table tbl_product_historic(
    cd_historic int primary key auto_increment,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    cd_prod int not null, FOREIGN KEY (cd_prod) REFERENCES tbl_products (cd_prod),
    datetime varchar(16) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
insert into tbl_product_historic (id_user, cd_prod, datetime) values (4, 164, "21/02/5414 10:25");
select 
            hist.cd_historic,
            hist.id_user,
            hist.cd_prod,
            hist.datetime,
            prod.cd_prod,
            prod.image_prod,
            prod.nm_product,
            prod.product_price
            from tbl_product_historic as hist inner join tbl_products as prod
            on hist.cd_prod = prod.cd_prod where hist.id_user = 4;

/* Table for Discounts */
drop table tbl_discounts;
create table tbl_discounts(
    cd_discounts int primary key auto_increment,
    name_tag varchar(20) not null,
    discount_total varchar(10) not null,
    max_uses int not null,
    used int default 0,
    expiry_date varchar(100) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
insert into tbl_discounts (name_tag, discount_total, max_uses, used, expiry_date) values ("primeiracompra", "20", 500, 0, "31/12/2021");
insert into tbl_discounts (name_tag, discount_total, max_uses, used, expiry_date) values ("souoprimeiro", "70", 1, 0, "31/12/2021");
insert into tbl_discounts (name_tag, discount_total, max_uses, used, expiry_date) values ("diapalace", "2", 500, 0, "31/12/2021");
insert into tbl_discounts (name_tag, discount_total, max_uses, used, expiry_date) values ("weekendpetz", "12", 500, 0, "31/12/2021");
insert into tbl_discounts (name_tag, discount_total, max_uses, used, expiry_date) values ("usooapp", "30", 500, 0, "31/12/2021");
update tbl_account set used_coupons = "no coupons" where id_user = 4;
update tbl_account set used_coupons = "no coupons" where id_user =34;
select * from tbl_discounts;

/*	Table for Server Details  */
drop table tbl_serverDetails;
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
update tbl_versionMobile set versionName = "1.3.4", versionCode = 8 where cd_version = 4;
select * from tbl_versionMobile;

-- Selects
select * from tbl_account;
select * from tbl_products;
select * from tbl_shoppingCart;
delete from tbl_cards where cd_card = 4;
select * from tbl_cards;
select * from tbl_discounts;
select * from tbl_serverDetails;
select * from tbl_orders;
select * from tbl_product_historic;