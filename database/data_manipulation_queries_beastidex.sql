-- Using colon : character to denote variables that will have data from the backend

-- SQL calls that relate to `Monsters` table

-- Get all data for a monster
SELECT `monsterID`, `name`, `description`, `size`, `type`, `alignment`, `armor_class`, `hit_dice`, `speed`, `fly_speed`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `challenge`, `source_book` FROM `Monsters`

-- Add a new monster to `Monsters` table
INSERT INTO `Monsters` (`name`, `description`, `size`, `type`, `alignment`, `armor_class`, `hit_dice`, `speed`, `fly_speed`, `strength`,
`dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `challenge`, `source_book`)
VALUES (:nameInput, :descriptionInput, :sizeInput, :typeInput, :alignmentInput, :armor_classInput, :hit_diceInput, :speedInput, :fly_speedInput,
:strengthInput, :dexterityInput, :constitutionInput, :intelligenceInput, :wisdomInput, :charismaInput, :challengeInput, :source_bookInput);

-- Update a monster from the row selected by User
UPDATE `Monsters` SET `name` = :nameInput, `description` = :descriptionInput, `size` = :sizeInput, `type` = :typeInput, `alignment` = alignmentInput, 
`armor_class` = :armor_classInput, `hit_dice` = :hit_diceInput, `speed` = :speedInput, `fly_speed` = :fly_speedInput, `strength` = :strengthInput,
`dexterity` = :dexterityInput, `constitution` = :constitutionInput, `intelligence` = :intelligenceInput, `wisdom` = :wisdomInput, 
`charisma` = :charismaInput, `challenge` =:challengeInput, `source_book` = :source_bookInput WHERE monsterID= monsterID_of_selected_row;

-- Deletes monster from the selected row
DELETE FROM `Monsters` WHERE monsterID= monsterID_of_selected_row;

-- Filter monsters by name entered by user
SELECT * FROM `Monsters` WHERE `name` = ":nameInput";

-------------------------------------------------------------------

-- SQL calls that relate to `Characters` table

-- Get all data for a character
SELECT `characterID`, `name`, `race`, `level`, `class`, `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, 
`partyID` FROM `Characters`;

-- Add new character to `Characters` table
INSERT INTO `Characters` (`name`, `race`, `level`, `class`, `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, 
`partyID` )
VALUES (:nameInput, :raceInput, :levelInput, :classInput, :strengthInput, :dexterityInput, :constitutionInput, :intelligenceInput, 
:wisdomInput, :charismaInput, :partyID);

-- Update a character from row selected by User
UPDATE `Characters` SET `name` = :nameInput, `race` = :raceInput, `level` = :levelInput, `class` = :classInput, `strength` = :strengthInput,
`dexterity` = :dexterityInput, `constitution` = :constitutionInput, `intelligence` = :intelligenceInput, `wisdom` = :wisdomInput, 
`charisma` = :charismaInput, `partyID` = :partyIDInput WHERE characterID= characterID_of_selected_row;

-- Deletes character from the selected row
DELETE FROM `Characters` WHERE characterID= characterID_of_selected_row;

-- Filter characters by name entered by user
SELECT * FROM `Characters` WHERE `name` = ":nameInput";

--------------------------------------------------------------------


-- SQL calls that relate to `Abilities` table

-- Get all data for an ability
SELECT `abilityID`, `name`, `damage_type`, `attack_range`, `damage_dice` FROM `Abilities`;

-- Add a new ability to `Abilities` table
INSERT INTO `Abilities` (`name`, `damage_type`, `attack_range`, `damage_dice`)
VALUES (:nameInput, :damage_typeInput, :attack_rangeInput, :damage_diceInput);

-- Update an ability from row selected by User
UPDATE `Abilities` SET `name` = :nameInput, `damage_type` = :damage_typeInput, 
attack_range = :attack_rangeInput, damage_dice = :damage_diceInput WHERE abilityID= abilityID_of_selected_row;

-- Deletes ability from selected row
DELETE FROM `Abilities` WHERE abilityID= abilityID_of_selected_row;

-- Filter abilities by name entered by user
SELECT * FROM `Abilities` WHERE `name` = ":nameInput";
----------------------------------------------------------------------


-- SQL calls that relate to `Biomes` table

-- Get all data for a biome
SELECT `biomeID`, `name`, `description` FROM `Biomes`;

-- Add a new biome to `Biomes` table
INSERT INTO `Biomes` (`name`, `description`)
VALUES (:nameInput, :descriptionInput);

-- Update a biome from row selected by User
UPDATE `Biomes` SET `name` = :nameInput, `description` = :descriptionInput
WHERE biomeID= biomeID_of_selected_row;

-- Delete biome from selected row
DELETE FROM `Biomes` WHERE biomeID= biomeID_of_selected_row;

-- Filter biomes by name entered by user
SELECT * FROM `Biomes` WHERE `name` = ":nameInput";

-----------------------------------------------------------------------


-- SQL calls that relate to `Parties` table

-- Get all data for a party
SELECT `partyID`, `name` FROM `Parties`;

-- Add a new party to `Parties` table
INSERT INTO `Parties` (`name`)
VALUES (:nameInput);

-- Update a party from row selected by User
UPDATE `Parties` SET `name` = :nameInput
WHERE partyID= partyID_of_selected_row;

-- Delete party from selected row, therefore making 
-- relevent party columns null
UPDATE `Characters` SET `partyID` = NULL WHERE partyID= partyID_of_selected_row;
DELETE FROM `Parties` WHERE partyID= partyID_of_selected_row


------------------------------------------------------------------------


-- SQL calls that relate to M:M relationship table `Monster_Biome`

-- Get all data
SELECT `monsterID`, `biomeID` FROM `Monster_Biome`;

-- Associate a monster with a biome and vice versa (M-to-M)
INSERT INTO `Monster_Biome` (`monsterID`, `biomeID`) 
VALUES (:monsterID, :biomeID);

-- Delete relationship
DELETE FROM `Monster_Biome` WHERE monsterID = :monsterID_from_Monsters AND
biomeID = :biomeID_from_Biomes;


------------------------------------------------------------------------


-- SQL calls that relate to M:M relationship table `Monster_Ability`

-- Get all data
SELECT `monsterID`, `abilityID` FROM `Monster_Ability`;

-- Associate a monster with an ability and vice versa (M-to-M)
INSERT INTO `Monster_Ability` (`monsterID`, `abilityID`) 
VALUES (:monsterID, :abilityID);

-- Delete relationship
DELETE FROM `Monster_Ability` WHERE monsterID = :monsterID_from_Monsters AND
abilityID = :abilityID_from_Biomes;


------------------------------------------------------------------------


-- SQL calls that relate to M:M relationship table `Character_Monster`

-- Get all data
SELECT `characterID`, `monsterID` FROM `Character_Monster`

-- Associate a character with a monster and vice versa (M-to-M)
INSERT INTO `Character_Monster` (`characterID`, `monsterID`) 
VALUES (:characterID, :monsterID);

-- Delete relationship
DELETE FROM `Character_Monster` WHERE characterID = :characterID_from_Characters AND
monsterID = :monsterID_from_Monsters;

