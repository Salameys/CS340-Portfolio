
DROP TABLE IF EXISTS `Monsters`;
DROP TABLE IF EXISTS `Characters`;
DROP TABLE IF EXISTS `Abilities`;
DROP TABLE IF EXISTS `Biomes`;
DROP TABLE IF EXISTS `Parties`;

CREATE TABLE `Monsters` (
`monsterID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` varchar(255) NOT NULL,
`size` varchar(255) NOT NULL,
`type` varchar(255) NOT NULL,
`alignment` varchar(2) NOT NULL,
`armor_class` int NOT NULL,
`hit_dice` varchar(255) NOT NULL,
`speed` varchar(255) NOT NULL,
`fly_speed` varchar(255),
`strength` int NOT NULL,
`dexterity` int NOT NULL,
`constitution` int NOT NULL,
`intelligence` int NOT NULL,
`wisdom` int NOT NULL,
`charisma` int NOT NULL,
`challenge` int NOT NULL,
`source_book` varchar(255) NOT NULL,
PRIMARY KEY (`monsterID`)
) ENGINE=InnoDB;

INSERT INTO `Monsters` (`name`, `description`, `size`, `type`, 
`alignment`, `armor_class`, `hit_dice`, `speed`, 
`fly_speed`, `strength`, `dexterity`, `constitution`,
`intelligence`, `wisdom`, `charisma`, `challenge`, `source_book`) 
VALUES ("Ancient White Dragon", "Terrifying beast of old", "Gargantuan", "Dragon", "CE",
"20", "18d20", "40ft", "80ft", "26", "10", "26", "10", "13", "14", "20", "MM");

CREATE TABLE `Characters` (
`characterID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`race` varchar(255) NOT NULL,
`level` INT(2) NOT NULL,
`class` varchar(255) NOT NULL,
`strength` int NOT NULL,
`dexterity` int NOT NULL,
`constitution` int NOT NULL,
`intelligence` int NOT NULL,
`wisdom` int NOT NULL,
`charisma` int NOT NULL,
 PRIMARY KEY (`characterID`)
) ENGINE=InnoDB;

INSERT INTO `Characters` (`name`, `race`, `level`, `class`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`)
VALUES ('Salah Salamey', 'Human', '20', 'Monk', '20', '20', '20',
'20', '20', '20'), ('Robert Sandfield', 'Human', '20', 'Wizard', '20', '20', '20',
'20', '20', '20');


CREATE TABLE `Abilities` (
`abilityID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`damage_type` varchar(255) NOT NULL,
`range` varchar(255) NOT NULL,
`damage_dice` varchar(255) NOT NULL,
PRIMARY KEY (`abilityID`)
) ENGINE=InnoDB;

INSERT INTO `Abilities` (`name`, `damage_type`, `range`, `damage_dice`)
VALUES ('Claw', 'Slashing', 'Melee', '2d4');
 
CREATE TABLE `Biomes` (
`biomeID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` text NOT NULL,
PRIMARY KEY (`biomeID`)
) ENGINE=InnoDB;

INSERT INTO `Biomes`(`name`, `description`)
VALUES('Desert', "I hate that sand, it's coarse and it gets everywhere");


CREATE TABLE `Parties` (
`partyID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
PRIMARY KEY (`partyID`)
) ENGINE=InnoDB;

INSERT INTO `Parties`(`name`) VALUES ('Database Comrades');

DROP TABLE IF EXISTS `Monster_Biome`;
CREATE TABLE `Monster_Biome` (
`monsterID` INT NOT NULL,
`biomeID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `biomeID`),
FOREIGN KEY fk_monster(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON DELETE CASCADE,
FOREIGN KEY fk_biome(`biomeID`)
REFERENCES `Biomes`(`biomeID`)
ON DELETE CASCADE);

DROP TABLE IF EXISTS `Monster_Ability`;
CREATE TABLE `Monster_Ability` (
`monsterID` INT NOT NULL,
`abilityID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `abilityID`),
FOREIGN KEY `fk_monster2`(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON DELETE CASCADE,
FOREIGN KEY `fk_ability`(`abilityID`)
REFERENCES `Abilities`(`abilityID`)
ON DELETE CASCADE);

DROP TABLE IF EXISTS `Character_Monster`;
CREATE TABLE `Character_Monster` (
`characterID` INT NOT NULL,
`monsterID` INT NOT NULL,
PRIMARY KEY (`characterID`, `monsterID`),
FOREIGN KEY `fk_character`(`characterID`)
REFERENCES `Characters`(`characterID`)
ON DELETE CASCADE,
FOREIGN KEY `fk_monster3`(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON DELETE CASCADE);



