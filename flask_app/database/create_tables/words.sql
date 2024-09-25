CREATE TABLE IF NOT EXISTS `words`(
`word_id`       int(100)        NOT NULL    auto_increment  COMMENT 'PK ID for the word',
`word`          varchar(30)     NOT NULL                    COMMENT 'word of the Day',
`date`          date            NOT NULL                    COMMENT 'The Day that is got pulled in',
PRIMARY KEY (`word_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Contains site words used for information";