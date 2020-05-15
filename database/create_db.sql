CREATE TABLE `monsters` (
`monsterID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` varchar(255) NOT NULL,
`size` varchar(255) NOT NULL,
`type` varchar(255) NOT NULL,
`alignment` varchar(2) NOT NULL,
`armor_class` int NOT NULL,
`hit_dice` varchar(255) NOT NULL,
`speed` varchar(255) INT NOT NULL,
`fly_speed` varchar(255) INT,
`strength` int NOT NULL,
`dexterity` int NOT NULL,
`constitution` int NOT NULL,
`intelligence` int NOT NULL,
`wisdom` int NOT NULL,
`charisma` int NOT NULL,
`challenge` int NOT NULL,
`source_book` varchar(255) NOT NULL
PRIMARY KEY (`monsterID`)
) ENGINE=InnoDB;

CREATE TABLE `characters` (
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

CREATE TABLE `abilities` (
`abilityID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`damage_type` varchar(255) NOT NULL,
`range` varchar(255) NOT NULL,
`damage_dice` varchar(255) NOT NULL,
PRIMARY KEY (`abilityID`)
) ENGINE=InnoDB;
 
CREATE TABLE `biomes` (
`biomeID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
`description` varchar(255) NOT NULL
PRIMARY KEY (`biomeID`)
) ENGINE=InnoDB;

CREATE TABLE `parties` (
`partyID` int(11) NOT NULL AUTO_INCREMENT,
`name` varchar(255) NOT NULL,
PRIMARY KEY (`partyID`)
) ENGINE=InnoDB;

CREATE TABLE `monster_biome` (
`monsterID` INT NOT NULL,
`biomeID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `biomeID`),
FOREIGN KEY fk_monster(`monsterID`)
REFERENCES `monsters`(`monsterID`)
ON DELETE CASCADE,
FOREIGN KEY fk_biome(`biomeID`)
REFERENCES `biomes`(`biomeID`)
ON DELETE CASCADE)

CREATE TABLE `monster_ability` (
`monsterID` INT NOT NULL,
`abilityID` INT NOT NULL,
PRIMARY KEY (`monsterID`, `abilityID`),
FOREIGN KEY `fk_monster2`(`monsterID`)
REFERENCES `monsters`(`monsterID`)
ON DELETE CASCADE,
FOREIGN KEY `fk_ability`(`abilityID`)
REFERENCES `abilities`(`abilityID`)
ON DELETE CASCADE)

ALTER TABLE `monsters` 
ADD FOREIGN KEY (`abilityID`) REFERENCES `abilities` (`abilityID`);

ALTER TABLE `monsters` 
ADD FOREIGN KEY (`biomeID`) REFERENCES `biomes` (`biomeID`);

ALTER TABLE `characters` 
ADD FOREIGN KEY (`partyID`) REFERENCES `parties` (`partyID`);

ALTER TABLE `abilities`
ADD FOREIGN KEY(`monsterID`) REFERENCES `monsters` (`monsterID`);

ALTER TABLE `biomes`
ADD FOREIGN KEY(`monsterID`) REFERENCES `monsters` (`monsterID`);

INSERT INTO `monsters` (`name`, `description`, `size`, `type`, 
`alignment`, `armor_class`, `hit_dice`, `speed`, 
`fly_speed`, `strength`, `dexterity`, `constitution`,
`intelligence`, `wisdom`, `charisma,`challenge`, `source_book`) VALUES
(`Ancient White Dragon`, `Terrifying beast of old`, `Gargantuan`, `Dragon`, `CE`,
`20`, `18d20`, `40ft`, `80ft`, `26`, `10`, `26`, `10`, `13`, `14`, 20`, `MM`);

INSERT INTO `characters` (`name`, `race`, `level`, `class`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`)
VALUES (`Salah Salamey`, `Human`, `20`, `Monk`, `20`, `20`, `20`,
`20`, `20`, `20`);

INSERT INTO `characters` (`name`, `race`, `level`, `class`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`)
VALUES (`Robert Sandfield`, `Human`, `20`, `Wizard`, `20`, `20`, `20`,
`20`, `20`, `20`);

INSERT INTO `abilities` (`name`, `damage_type`, `range`, `damage_dice`)
VALUES (`Claw`, `Slashing`, `Melee`, `2d4`);

INSERT INTO `biomes`(`name`, `description`)
VALUES(`Desert`, `I hate that sand, it's coarse and it gets everywhere`);

INSERT INTO `parties`(`name`) VALUES (`Database Comrades`);


