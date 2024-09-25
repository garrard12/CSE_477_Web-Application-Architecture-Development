CREATE TABLE IF NOT EXISTS `feedback`(
`comment_id`   int(100)    NOT NULL    AUTO_INCREMENT    COMMENT 'PK:The feedback id',
`name`      varchar(1000)    NOT NULL                    COMMENT 'The commentators name',
`email`     varchar(1000)    NOT NULL                    COMMENT 'The commentators email',
`comment`   varchar(1000)    NOT NULL                    COMMENT 'The text of the comment',
PRIMARY KEY (`comment_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Feedback from user on the website";

--
--
-- comment_id: the primary key, and unique identifier for each comment.
--
--
-- name: the commentators name
--
--
-- email:  the commentators email
--
--
-- comment:  The text of the comment






