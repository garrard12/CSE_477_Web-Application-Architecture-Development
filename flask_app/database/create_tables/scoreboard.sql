CREATE TABLE IF NOT EXISTS `scoreboard`(
    `score_id`      int(100)        NOT NULL auto_increment COMMENT 'PK the id of this score',
    `user_name`     varchar(100)    NOT NULL                COMMENT 'The user name',
    `score`         int(10)         NOT NULL                COMMENT 'score of the user',
    `date`          date            NOT NULL                COMMENT 'The day they score submitted',
PRIMARY KEY (`score_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Contains site score form users";