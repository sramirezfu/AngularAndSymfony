CREATE DATABASE IF NOT EXISTS api_rest_symfony;

USE api_rest_symfony;

CREATE TABLE users(
id                      int(255) auto_increment NOT NULL,
name                    varchar(50) NOT NULL,
surname                 varchar(50) NOT NULL,
role                    varchar(20),
email                   varchar(255) NOT NULL,
password                varchar(255) NOT NULL,
description             text,
image                   varchar(255),
created_at              datetime DEFAULT CURRENT_TIMESTAMP,
update_at               datetime DEFAULT CURRENT_TIMESTAMP,
remember_token          varchar(255),
CONSTRAINT pk_users PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE categories(
id                      int(255) auto_increment NOT NULL,
name                    varchar(100) NOT NULL,
created_at              datetime DEFAULT CURRENT_TIMESTAMP,
update_at               datetime DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_categories PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE videos(
id                      int(255) auto_increment NOT NULL,
user_id                 int(255) NOT NULL,
category_id             int(255) NOT NULL,
title                   int(255) NOT NULL,
content                 text NOT NULL,
url                     varchar(255) NOT NULL,
status                  varchar(50),
created_at              datetime DEFAULT CURRENT_TIMESTAMP,
update_at               datetime DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT pk_videos PRIMARY KEY(id),
CONSTRAINT fk_video_user FOREIGN KEY(user_id) REFERENCES users(id),
CONSTRAINT fk_video_category FOREIGN KEY(category_id) REFERENCES categories(id)
)ENGINE=InnoDb;