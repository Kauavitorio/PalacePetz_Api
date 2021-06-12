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
    username varchar(600) not null,
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
ALTER TABLE tbl_cards auto_increment = 2542;

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
drop table if exists tbl_orders;
create table tbl_orders(
    cd_order int primary key auto_increment,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    date_order varchar(600) not null,
    coupom varchar(600),
    discount varchar(600),
    totalPrice varchar(600) not null,
    sub_total varchar(600) not null,
    cd_card int not null,
    status varchar(600) not null,
    deliveryTime int default 45 not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
ALTER TABLE tbl_orders auto_increment = 26542;

-- Table for Orders Itens
drop table if exists tbl_orders_items;
create table tbl_orders_items(
    cd_order int not null , FOREIGN KEY (cd_order) REFERENCES tbl_orders (cd_order),
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    cd_prod int not null, FOREIGN KEY (cd_prod) REFERENCES tbl_products (cd_prod),
    product_amount int not null, 
    product_price varchar(20) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
ALTER TABLE tbl_orders auto_increment = 242;

-- Table for Pets
drop table if exists tbl_pets;
create table tbl_pets(
    cd_animal int primary key auto_increment,
    nm_animal varchar(500) not null,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    breed_animal varchar(500) not null,
    age_animal varchar(500) not null,
    weight_animal varchar(500) not null,
    species_animal varchar(500) not null,
    image_animal varchar(600) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
ALTER TABLE tbl_pets auto_increment = 252;

-- Table for products historic
drop table if exists tbl_product_historic;
create table tbl_product_historic(
    cd_historic int primary key auto_increment,
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user),
    cd_prod int not null, FOREIGN KEY (cd_prod) REFERENCES tbl_products (cd_prod),
    datetime varchar(16) not null
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;

/* Table for Discounts */
drop table if exists tbl_discounts;
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
select * from tbl_discounts;

-- Table for Used Coupons 
drop table if exists tbl_coupons_used;
create table tbl_coupons_used(
    cd_discounts int not null , FOREIGN KEY (cd_discounts) REFERENCES tbl_discounts (cd_discounts),
    id_user int not null, FOREIGN KEY (id_user) REFERENCES tbl_account (id_user)
)DEFAULT CHARACTER SET utf8  DEFAULT COLLATE utf8_general_ci;
ALTER TABLE tbl_orders auto_increment = 242;

DELIMITER $$
drop procedure if exists spDiscounts_ActivateDiscount;
CREATE PROCEDURE spDiscounts_ActivateDiscount($id_user int, $cd_discounts int, $used int)
BEGIN
		insert into tbl_coupons_used (cd_discounts, id_user) values ($cd_discounts, $id_user);
        update tbl_discounts set used = $used where cd_discounts = $cd_discounts;
END $$
DELIMITER ;


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
update tbl_versionMobile set versionName = "1.4.3", versionCode = 14 where cd_version = 4;
select * from tbl_versionMobile;

-- Selects
select * from tbl_account;
select * from tbl_products;
select * from tbl_category;
select * from tbl_pets;
select * from tbl_shoppingCart;
select * from tbl_orders_items;
select * from tbl_orders;
select * from tbl_cards;
select * from tbl_discounts;
select * from tbl_coupons_used;
select * from tbl_serverDetails;
select * from tbl_product_historic;