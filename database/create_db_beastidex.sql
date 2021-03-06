DROP TABLE IF EXISTS `Monster_Biome`;
DROP TABLE IF EXISTS `Monster_Ability`;
DROP TABLE IF EXISTS `Character_Monster`;
DROP TABLE IF EXISTS `Monsters`;
DROP TABLE IF EXISTS `Characters`;
DROP TABLE IF EXISTS `Abilities`;
DROP TABLE IF EXISTS `Biomes`;
DROP TABLE IF EXISTS `Parties`;

CREATE TABLE `Monsters` (
`monsterID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` varchar(255) NOT NULL,
`type` varchar(255) NOT NULL,
`alignment` varchar(2) NOT NULL,
`armor_class` int NOT NULL,
`hit_dice` varchar(255) NOT NULL,
`speed` int NOT NULL,
`fly_speed` int,
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
`partyID` int,
 PRIMARY KEY (`characterID`)
) ENGINE=InnoDB;

CREATE TABLE `Abilities` (
`abilityID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`damage_type` varchar(255) NOT NULL,
`attack_range` varchar(255) NOT NULL,
`damage_dice` varchar(255) NOT NULL,
PRIMARY KEY (`abilityID`)
) ENGINE=InnoDB;
 
CREATE TABLE `Biomes` (
`biomeID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` varchar(255) NOT NULL,
PRIMARY KEY (`biomeID`)
) ENGINE=InnoDB;

CREATE TABLE `Parties` (
`partyID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
PRIMARY KEY (`partyID`)
) ENGINE=InnoDB;

CREATE TABLE `Monster_Biome` (
`monsterID` INT NOT NULL,
`biomeID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `biomeID`),
FOREIGN KEY fk_monster(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY fk_biome(`biomeID`)
REFERENCES `Biomes`(`biomeID`)
ON UPDATE CASCADE
ON DELETE CASCADE);

CREATE TABLE `Monster_Ability` (
`monsterID` INT NOT NULL,
`abilityID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `abilityID`),
FOREIGN KEY `fk_monster2`(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY `fk_ability`(`abilityID`)
REFERENCES `Abilities`(`abilityID`)
ON UPDATE CASCADE
ON DELETE CASCADE);

CREATE TABLE `Character_Monster` (
`characterID` INT NOT NULL,
`monsterID` INT NOT NULL,
PRIMARY KEY (`characterID`, `monsterID`),
FOREIGN KEY `fk_character`(`characterID`)
REFERENCES `Characters`(`characterID`)
ON UPDATE CASCADE
ON DELETE CASCADE,
FOREIGN KEY `fk_monster3`(`monsterID`)
REFERENCES `Monsters`(`monsterID`)
ON UPDATE CASCADE
ON DELETE CASCADE);


ALTER TABLE `Characters`
ADD FOREIGN KEY `partyID` (`partyID`) 
REFERENCES `Parties` (`partyID`);


INSERT INTO `Parties`(`name`) 
VALUES ('Database Comrades'),
('Mighty Nein'),
('The Fellowship');

INSERT INTO `Monsters` (`name`, `description`, `type`, 
`alignment`, `armor_class`, `hit_dice`, `speed`, 
`fly_speed`, `strength`, `dexterity`, `constitution`,
`intelligence`, `wisdom`, `charisma`, `challenge`, `source_book`) 
VALUES ("Ancient White Dragon", "Terrifying beast of old", "Dragon", "CE", "20", "18d20", "40", "80", "26", "10", "26", "10", "13", "14", "20", "MM"),
('Cat', 'Meow', 'Beast', 'CN', '12', '1d4', '40', '0', '3', '15', '10', '3','12', '7', '0', 'PHB'),
('Lich', 'Super Evil, Super Undead, Lots of Magic, WOW', 'Undead', 'EE', '17', '18d8', '30', '0', '11', '16', '16', '20', '14', '16', '21', 'MM');

INSERT INTO `Characters` (`name`, `race`, `level`, `class`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `partyID`)
VALUES ('Salah Salamey', 'Human', '20', 'Monk', '20', '20', '20', '20', '20', '20', 1), 
('Robert Sandfield', 'Human', '20', 'Wizard', '20', '20', '20', '20', '20', '20', 1), 
('Jeffosaurus', 'Dinosaur', '20', 'Barbarian', '20', '20', '20', '20', '20', '20', NULL);

INSERT INTO `Abilities` (`name`, `damage_type`, `attack_range`, `damage_dice`)
VALUES ('Claw', 'Slashing', 'Melee', '2d4'), 
('Bite', 'Piercing', 'Melee', '2d6'),
('Paralyzing Touch', 'Cold', '5ft', '3d6');

INSERT INTO `Biomes`(`name`, `description`)
VALUES('Desert', "I hate that sand, it's coarse and it gets everywhere"), 
 ('Frozen Wastes', "It's cold, and full of waste!"),
 ('Jungle', "Home place of Tarzan and his less known counterpart George...of the Jungle");

INSERT INTO `Monster_Biome` (`monsterID`, `biomeID`) 
VALUES (1,2), (2,1), (2,2);

INSERT INTO `Monster_Ability` (`monsterID`, `abilityID`)
VALUES (1,1), (1,2), (2,1);

INSERT INTO `Character_Monster` (`characterID`, `monsterID`)
VALUES (1,1), (1,2), (2,1), (2,2);







