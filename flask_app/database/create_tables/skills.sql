CREATE TABLE IF NOT EXISTS `skills`(
`skill_id`          int(100)        NOT NULL    AUTO_INCREMENT      COMMENT 'PK:The skills id',
`experience_id`     int(100)        NOT NULL                        COMMENT 'FK: The experience id',
`name`              varchar(1000)   NOT NULL                        COMMENT 'The name of the skill',
`skill_level`       int(10)         NOT NULL                        COMMENT 'The level of the skill; 1 being worst, 10 being best',
PRIMARY KEY (`skill_id`),
FOREIGN KEY (experience_id) REFERENCES experiences(experience_id)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="The skills that I have acquired for each experiences";


/*
skill_id:  the primary key, and unique identifier for each skill

experience_id: a foreign key that references  experiences.experience_id

name: the name of the skill

skill_level: the level of the skill; 1 being worst, 10 being best.*/