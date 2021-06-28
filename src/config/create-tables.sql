CREATE DATABASE IF NOT EXISTS etherpad_lite_db;

use etherpad_lite_db;

CREATE TABLE IF NOT EXISTS `user_applications` (
	`user_id` int(11) AUTO_INCREMENT NOT NULL,
	`application_id` int(11) NOT NULL,
    `token` varchar(255) COLLATE utf8_bin NOT NULL,
    primary key (`user_id`, `token`)
	);

CREATE TABLE IF NOT EXISTS `applications` (
	`application_id` int(11) AUTO_INCREMENT NOT NULL,
	`name` varchar(255) COLLATE utf8_bin NOT NULL,
    `client_id` varchar(255) COLLATE utf8_bin NOT NULL,
    `client_secret` varchar(255) COLLATE utf8_bin NOT NULL,
    primary key (`application_id`, `client_id`)
	);