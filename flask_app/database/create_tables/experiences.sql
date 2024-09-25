CREATE TABLE IF NOT EXISTS `experiences`(
    `experience_id`     int(100)        NOT NULL    AUTO_INCREMENT  COMMENT 'PK: The experience id',
    `position_id`       int(100)        NOT NULL                    COMMENT 'FK: position id ',
    `name`              varchar(1000)   NOT NULL                    COMMENT 'The name of the experience',
    `description`       varchar(1000)   NOT NULL                    COMMENT 'Description of the experience',
    `hyperlink`         varchar(1000)   DEFAULT NULL                COMMENT 'A link where people can learn more about the experience',
    `start_date`        date            DEFAULT NULL                COMMENT 'The start date of the experience',
    `end_date`          date            DEFAULT NULL                COMMENT 'The end date of the experience.',
    PRIMARY KEY (`experience_id`),
    FOREIGN KEY (position_id) REFERENCES positions(position_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="The experiences I had at each position"

-- experience_id: the primary key, and unique identifier for each experience
--
-- position_id: a foreign key that references  positions.position_id
--
--
-- name: the name of the experience.
--
-- description: a description of the experience.
--
-- hyperlink: a link where people can learn more about the experience.
--
-- start_date: the state date of the experience.
--
-- end_date: the end date of the experience.