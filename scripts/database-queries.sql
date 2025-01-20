DROP SCHEMA IF EXISTS qs_example;
CREATE SCHEMA `qs_example` ;
USE qs_example;
#=============================================================================== CLIENTS QUERYS
DROP TABLE IF EXISTS client;
CREATE TABLE client (
  id int(11) NOT NULL,
  name varchar(255) NOT NULL,
  address varchar(255),
  postcode varchar(255),
  email varchar(255),
  nif varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

 ALTER TABLE client MODIFY COLUMN id INT primary key auto_increment NOT NULL;
 ALTER TABLE client ADD UNIQUE `client_unique_index` (name, email, nif);
    
INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('Amália Rosário', 'Rua grande', '6000', 'amalia_rosario@email.com', '123');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('Joaquim Antunes', 'Rua da eira', '6001', 'joaquim_antunes@email.com', '1234');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('Rui Neto', 'Rua da pedregueira', '6002', 'rui_neto@email.com', '12345');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('Joana Martins', 'Rua do cabeço', '6003', 'joana_martins@email.com', '21235');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('Pedro Filipe', 'Rua do cabeço', '6005', 'pedro_filipe@email.com', '85462412');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('António Pedro', 'Rua das margens', '6007', 'antonio_pedro@email.com', '8411251');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('João Rosa', 'Rua das margens', '2034', 'joao_rosa@email.com', '012536');

INSERT INTO `client` (`name`, `address`, `postcode`, `email`, `nif`) VALUES
('roberto Matias', 'Rua das margens', '5212', 'roberto_matias@email.com', '985002');


#=============================================================================== USERS QUERYS
DROP TABLE IF EXISTS user;
CREATE TABLE user (
  id int NOT NULL,
  userName varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) DEFAULT null,
  password varchar(255) DEFAULT null,
  role varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

ALTER TABLE user MODIFY COLUMN id INT primary key auto_increment NOT NULL;

ALTER TABLE user ADD UNIQUE `user_unique_index` (username, name, email);

insert into `user`(userName, name, email, password, role) 
values('renatoreis', 'Alcirio Reis', 'renato@gmail.com','123456', 'A');

insert into `user`(userName, name, email, password, role) 
values('nunesd', 'Daniel Nunes', 'daniel@gmail.com','123456', 'A');


#=============================================================================== CODES QUERYS
DROP TABLE IF EXISTS codes;
CREATE TABLE codes (
  domain varchar(30) NOT NULL,
  code varchar(4) NOT NULL,
  description varchar(255) NOT NULL,
  display_order int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

ALTER TABLE codes ADD UNIQUE `codes_unique_index` (domain, code, description);

insert into codes(domain, description, code, display_order) 
values('JOB_STATUS', 'Em progresso', '1', 1);
insert into codes(domain, description, code, display_order) 
values('JOB_STATUS', 'Pendente', '2', 2);
insert into codes(domain, description, code, display_order)  
values('JOB_STATUS', 'Em espera', '3', 3);
insert into codes(domain, description, code, display_order)  
values('JOB_STATUS', 'Concluido', '4', 4);
insert into codes(domain, description, code, display_order)  
values('JOB_STATUS', 'A espera de material', '5', 5);


insert into codes(domain, description, code, display_order)  
values('JOB_PRIORITY', 'Prioridade máxima', '1', 1);
insert into codes(domain, description, code, display_order)  
values('JOB_PRIORITY', 'Prioridade média', '2', 2);
insert into codes(domain, description, code, display_order)  
values('JOB_PRIORITY', 'Prioridade normal', '3', 3);
insert into codes(domain, description, code, display_order)  
values('JOB_PRIORITY', 'Prioridade baixa', '4', 4);


insert into codes(domain, description, code, display_order)  
values('USER_ROLE', 'Administrador', 'A', 1);
insert into codes(domain, description, code, display_order)  
values('USER_ROLE', 'Operador', 'O', 2);


insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'Telefone', '1', 1);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'Computador-Torre', '2', 2);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'Computador-Laptop', '3', 3);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'iPad', '4', 4);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'Chave Carro', '5', 5);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'GameBoy', '6', 6);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT', 'Outro', '100', 100);


insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'iPhone', '1', 1);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'iPad', '2', 2);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'iPod', '3', 3);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Macbook Air', '4', 4);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Macbook Pro', '5', 5);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Samsung', '6', 6);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Nokia', '7', 7);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Xiaomi', '8', 8);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Huawei', '9', 9);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Oppo', '10', 10);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Lenovo', '11', 11);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Lg', '12', 12);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'ZTE', '13', 13);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Epson', '14', 14);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Nintendo', '15', 15);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Asus', '16', 16);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Acer', '17', 17);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'NEC', '18', 18);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Fujitsu', '19', 19);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'IBM', '20', 20);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Toshiba', '21', 21);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Dell', '22', 22);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'HP', '23', 23);
insert into codes(domain, description, code, display_order)  
values('JOB_BRAND', 'Outro', '100', 100);


insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir bateria', '1', 1);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir ecrã', '2', 2);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir altifalante', '3', 3);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir câmera', '4', 4);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir porta de carregamento', '5', 5);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir botões', '6', 6);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir frame', '7', 7);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir disco rígido', '8', 8);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir ram', '9', 9);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir processador', '10', 10);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir ventuinhas', '11', 11);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir cabos', '12', 12);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Substituir gráfica', '13', 13);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Micro-solda', '14', 14);
insert into codes(domain, description, code, display_order)  
values('JOB_EQUIPEMENT_PROCEDURE', 'Outro', '100', 100);


#=============================================================================== HOME QUERYS
DROP TABLE IF EXISTS job;
CREATE TABLE job (
  id int NOT NULL,
  userId int NOT NULL,
  userIdClient int NOT NULL,
  DateStarted datetime NOT NULL,
  Status varchar(4) NOT NULL,
  Equipment_Type varchar(4) NOT NULL,
  Equipment_Brand varchar(4) NOT NULL,
  Equipment_Type_Other varchar(255),
  Equipment_Procedure varchar(4) NOT NULL,
  Equipment_Procedure_Other varchar(255),
  Notes varchar(255),
  DateFinished datetime,
  USERIDFINALISED int,
  Priority varchar(4) NOT NULL,
  Priority_Work int
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

ALTER TABLE job MODIFY COLUMN id INT primary key auto_increment NOT NULL;


#=============================================================================== MESSAGES QUERYS
DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  message_id int NOT NULL,
  message_sent_by int NOT NULL,
  message_to int NOT NULL,
  message_from int NOT NULL,
  message varchar(255) NOT NULL,
  date_created datetime NOT NULL,
  seen varchar(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf16;

ALTER TABLE messages MODIFY COLUMN message_id INT primary key auto_increment NOT NULL;
