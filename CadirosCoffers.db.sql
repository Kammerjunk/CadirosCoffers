BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Build" (
	"BuildId"	TEXT NOT NULL UNIQUE,
	"Name"	TEXT,
	"GameVersion"	TEXT,
	PRIMARY KEY("BuildId")
);
CREATE TABLE IF NOT EXISTS "GuideStepCategory" (
	"CategoryId"	TEXT NOT NULL UNIQUE,
	"Text"	TEXT NOT NULL,
	PRIMARY KEY("CategoryId")
);
CREATE TABLE IF NOT EXISTS "Attribute" (
	"AttributeId"	TEXT NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS "Gem" (
	"GemId"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Active"	INTEGER NOT NULL DEFAULT 1,
	"MaxLevel"	INTEGER,
	"GemLinkId"	INTEGER NOT NULL,
	"AttributeId"	INTEGER NOT NULL,
	FOREIGN KEY("GemLinkId") REFERENCES "GemLink"("GemLinkId"),
	FOREIGN KEY("AttributeId") REFERENCES "Attribute"("AttributeId"),
	PRIMARY KEY("GemId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "GuideStepPoint" (
	"GuideStepPointId"	INTEGER NOT NULL UNIQUE,
	"Text"	TEXT NOT NULL,
	"ParentPoint"	INTEGER,
	"StepId"	INTEGER NOT NULL,
	"StepPointIndex"	INTEGER NOT NULL,
	FOREIGN KEY("StepId") REFERENCES "GuideStep"("GuideStepId"),
	PRIMARY KEY("GuideStepPointId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "GuideStep" (
	"GuideStepId"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"Category"	TEXT NOT NULL,
	"Act"	INTEGER NOT NULL,
	"ActStepIndex"	INTEGER NOT NULL,
	"BuildId"	TEXT NOT NULL,
	FOREIGN KEY("BuildId") REFERENCES "Build"("BuildId"),
	FOREIGN KEY("Category") REFERENCES "GuideStepCategory"("CategoryId"),
	PRIMARY KEY("GuideStepId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "GemLink" (
	"GemLinkId"	INTEGER NOT NULL UNIQUE,
	"Act"	INTEGER NOT NULL,
	"BuildId"	TEXT NOT NULL,
	PRIMARY KEY("GemLinkId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TargetLevel" (
	"TargetLevelId"	INTEGER NOT NULL UNIQUE,
	"Act"	INTEGER NOT NULL,
	"BuildId"	TEXT NOT NULL,
	"Level"	TEXT NOT NULL,
	"Progress"	TEXT NOT NULL,
	FOREIGN KEY("BuildId") REFERENCES "Build"("BuildId"),
	PRIMARY KEY("TargetLevelId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "ZoneMap" (
	"ZoneMapId"	INTEGER NOT NULL UNIQUE,
	"Act"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"FileName"	TEXT NOT NULL,
	"ZoneIndex"	INTEGER NOT NULL,
	PRIMARY KEY("ZoneMapId" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "User" (
	"UserId"	INTEGER NOT NULL UNIQUE,
	"Username"	TEXT NOT NULL UNIQUE,
	"Password"	TEXT,
	"Salt"	TEXT,
	PRIMARY KEY("UserId" AUTOINCREMENT)
);
INSERT INTO "Build" VALUES ('roa-warden','RoA Warden','3.25');
INSERT INTO "Build" VALUES ('deadeye-elehit','Deadeye Elemental Hit','3.25');
INSERT INTO "GuideStepCategory" VALUES ('QUEST','Quest');
INSERT INTO "GuideStepCategory" VALUES ('WAYPOINT','Waypoint');
INSERT INTO "GuideStepCategory" VALUES ('LEVEL','Level');
INSERT INTO "GuideStepCategory" VALUES ('CONTINUE','Continue');
INSERT INTO "GuideStepCategory" VALUES ('OVERVIEW','Overview');
INSERT INTO "GuideStepCategory" VALUES ('BEGINNING','Beginning');
INSERT INTO "GuideStepCategory" VALUES ('ZONE','Zone');
INSERT INTO "GuideStepCategory" VALUES ('GEM','Gem');
INSERT INTO "Attribute" VALUES ('STR','Strength');
INSERT INTO "Attribute" VALUES ('DEX','Dexterity');
INSERT INTO "Attribute" VALUES ('INT','Intelligence');
INSERT INTO "Gem" VALUES (1,'Rain of Arrows',1,NULL,1,'DEX');
INSERT INTO "Gem" VALUES (2,'Mirage Archer Support',1,NULL,1,'DEX');
INSERT INTO "Gem" VALUES (3,'Added Cold Damage Support',1,NULL,1,'DEX');
INSERT INTO "Gem" VALUES (4,'Shrapnel Ballista',1,NULL,2,'DEX');
INSERT INTO "Gem" VALUES (5,'Pierce Support',1,NULL,2,'DEX');
INSERT INTO "Gem" VALUES (6,'Blink Arrow',1,NULL,3,'DEX');
INSERT INTO "Gem" VALUES (7,'Precision',1,NULL,4,'DEX');
INSERT INTO "Gem" VALUES (8,'Rain of Arrows',1,NULL,5,'DEX');
INSERT INTO "Gem" VALUES (9,'Mirage Archer Support',1,NULL,5,'DEX');
INSERT INTO "Gem" VALUES (10,'Added Cold Damage Support',1,NULL,5,'DEX');
INSERT INTO "Gem" VALUES (11,'Shrapnel Ballista',1,NULL,6,'DEX');
INSERT INTO "Gem" VALUES (12,'Pierce Support',1,NULL,6,'DEX');
INSERT INTO "Gem" VALUES (13,'Elemental Damage with Attacks Support',1,NULL,6,'STR');
INSERT INTO "Gem" VALUES (14,'Blink Arrow',1,NULL,7,'DEX');
INSERT INTO "Gem" VALUES (15,'Precision',1,NULL,8,'DEX');
INSERT INTO "Gem" VALUES (16,'Herald of Ice',1,NULL,9,'DEX');
INSERT INTO "Gem" VALUES (17,'Blood Rage',1,NULL,10,'DEX');
INSERT INTO "Gem" VALUES (18,'Elemental Damage with Attacks Support',0,NULL,11,'STR');
INSERT INTO "Gem" VALUES (19,'Elemental Damage with Attacks Support',0,NULL,11,'STR');
INSERT INTO "Gem" VALUES (20,'Rain of Arrows',1,NULL,12,'DEX');
INSERT INTO "Gem" VALUES (21,'Mirage Archer Support',1,NULL,12,'DEX');
INSERT INTO "Gem" VALUES (22,'Elemental Damage with Attacks Support',1,NULL,12,'STR');
INSERT INTO "Gem" VALUES (23,'Elemental Focus Support',1,NULL,12,'INT');
INSERT INTO "Gem" VALUES (24,'Artillery Ballista',1,NULL,13,'DEX');
INSERT INTO "Gem" VALUES (25,'Faster Attacks Support',1,NULL,13,'DEX');
INSERT INTO "Gem" VALUES (26,'Elemental Damage with Attacks Support',1,NULL,13,'STR');
INSERT INTO "Gem" VALUES (27,'Added Cold Damage Support',1,NULL,13,'DEX');
INSERT INTO "Gem" VALUES (28,'Blink Arrow',1,NULL,14,'DEX');
INSERT INTO "Gem" VALUES (29,'Precision',1,1,15,'DEX');
INSERT INTO "Gem" VALUES (30,'Haste',1,NULL,15,'DEX');
INSERT INTO "Gem" VALUES (31,'Anger',1,NULL,15,'STR');
INSERT INTO "Gem" VALUES (32,'Sniper''s Mark',1,NULL,16,'DEX');
INSERT INTO "Gem" VALUES (33,'Blood Rage',1,NULL,17,'DEX');
INSERT INTO "Gem" VALUES (36,'Rain of Arrows',1,NULL,19,'DEX');
INSERT INTO "Gem" VALUES (37,'Mirage Archer Support',1,NULL,19,'DEX');
INSERT INTO "Gem" VALUES (38,'Elemental Damage with Attacks Support',1,NULL,19,'STR');
INSERT INTO "Gem" VALUES (39,'Elemental Focus Support',1,NULL,19,'INT');
INSERT INTO "Gem" VALUES (40,'Artillery Ballista',1,NULL,20,'DEX');
INSERT INTO "Gem" VALUES (41,'Faster Attacks Support',1,NULL,20,'DEX');
INSERT INTO "Gem" VALUES (42,'Elemental Damage with Attacks Support',1,NULL,20,'STR');
INSERT INTO "Gem" VALUES (43,'Added Cold Damage Support',1,NULL,20,'DEX');
INSERT INTO "Gem" VALUES (44,'Blink Arrow',1,NULL,21,'DEX');
INSERT INTO "Gem" VALUES (45,'Precision',1,NULL,22,'DEX');
INSERT INTO "Gem" VALUES (46,'Haste',1,NULL,22,'DEX');
INSERT INTO "Gem" VALUES (47,'Anger',1,NULL,22,'STR');
INSERT INTO "Gem" VALUES (48,'Sniper''s Mark',1,NULL,23,'DEX');
INSERT INTO "Gem" VALUES (49,'Mark on Hit',1,NULL,23,'DEX');
INSERT INTO "Gem" VALUES (50,'Blood Rage',1,NULL,24,'DEX');
INSERT INTO "Gem" VALUES (52,'Rain of Arrows',1,NULL,26,'DEX');
INSERT INTO "Gem" VALUES (53,'Mirage Archer Support',1,NULL,26,'DEX');
INSERT INTO "Gem" VALUES (54,'Inspiration Support',1,NULL,26,'STR');
INSERT INTO "Gem" VALUES (55,'Trinity Support',1,NULL,26,'INT');
INSERT INTO "Gem" VALUES (56,'Artillery Ballista',1,NULL,27,'DEX');
INSERT INTO "Gem" VALUES (57,'Faster Attacks Support',1,NULL,27,'DEX');
INSERT INTO "Gem" VALUES (58,'Inspiration Support',1,NULL,27,'STR');
INSERT INTO "Gem" VALUES (59,'Added Cold Damage Support',1,NULL,27,'DEX');
INSERT INTO "Gem" VALUES (60,'Flame Dash',1,NULL,28,'INT');
INSERT INTO "Gem" VALUES (61,'Precision',1,NULL,29,'DEX');
INSERT INTO "Gem" VALUES (62,'Haste',1,NULL,29,'DEX');
INSERT INTO "Gem" VALUES (63,'Anger',1,NULL,29,'STR');
INSERT INTO "Gem" VALUES (64,'Sniper''s Mark',1,NULL,30,'DEX');
INSERT INTO "Gem" VALUES (65,'Mark on Hit',1,NULL,30,'DEX');
INSERT INTO "Gem" VALUES (66,'Blood Rage',1,NULL,31,'DEX');
INSERT INTO "Gem" VALUES (67,'Elemental Damage with Attacks Support',0,NULL,32,'STR');
INSERT INTO "Gem" VALUES (68,'Elemental Damage with Attacks Support',0,NULL,32,'STR');
INSERT INTO "Gem" VALUES (69,'Rain of Arrows',1,NULL,33,'DEX');
INSERT INTO "Gem" VALUES (70,'Mirage Archer Support',1,NULL,33,'DEX');
INSERT INTO "Gem" VALUES (71,'Inspiration Support',1,NULL,33,'STR');
INSERT INTO "Gem" VALUES (72,'Trinity Support',1,NULL,33,'INT');
INSERT INTO "Gem" VALUES (73,'Artillery Ballista',1,NULL,34,'DEX');
INSERT INTO "Gem" VALUES (74,'Faster Attacks Support',1,NULL,34,'DEX');
INSERT INTO "Gem" VALUES (75,'Inspiration Support',1,NULL,34,'STR');
INSERT INTO "Gem" VALUES (76,'Added Cold Damage Support',1,NULL,34,'DEX');
INSERT INTO "Gem" VALUES (77,'Flame Dash',1,NULL,35,'INT');
INSERT INTO "Gem" VALUES (78,'Precision',1,1,36,'DEX');
INSERT INTO "Gem" VALUES (79,'Haste',1,NULL,36,'DEX');
INSERT INTO "Gem" VALUES (80,'Anger',1,NULL,36,'STR');
INSERT INTO "Gem" VALUES (81,'Grace',1,NULL,36,'DEX');
INSERT INTO "Gem" VALUES (82,'Sniper''s Mark',1,NULL,37,'DEX');
INSERT INTO "Gem" VALUES (83,'Mark on Hit',1,NULL,37,'DEX');
INSERT INTO "Gem" VALUES (84,'Blood Rage',1,NULL,38,'DEX');
INSERT INTO "Gem" VALUES (85,'Elemental Damage with Attacks Support',0,NULL,39,'STR');
INSERT INTO "Gem" VALUES (86,'Elemental Damage with Attacks Support',0,NULL,39,'STR');
INSERT INTO "GuideStepPoint" VALUES (1,'Quest reward: <span class="dexterity">Galvanic Arrow</span>',NULL,1,1);
INSERT INTO "GuideStepPoint" VALUES (2,'Check vendors:',NULL,1,2);
INSERT INTO "GuideStepPoint" VALUES (3,'+10% Movement Speed boots',2,1,1);
INSERT INTO "GuideStepPoint" VALUES (4,'<span class="dexterity">G</span>-<span class="dexterity">G</span>-<span class="dexterity">G</span> chest, gloves, or helmet<br />(if none found, spend 3 scrolls on an Iron Ring for DPS)',2,1,2);
INSERT INTO "GuideStepPoint" VALUES (5,'Quest reward: <span class="dexterity">Shrapnel Ballista</span>',NULL,2,1);
INSERT INTO "GuideStepPoint" VALUES (6,'Quest reward: <span class="dexterity">Dash</span>',NULL,2,2);
INSERT INTO "GuideStepPoint" VALUES (7,'Quest reward: Quicksilver Flask',NULL,3,1);
INSERT INTO "GuideStepPoint" VALUES (8,'Quest reward: <span class="dexterity">Mirage Archer</span>',NULL,3,2);
INSERT INTO "GuideStepPoint" VALUES (9,'Buy: <span class="dexterity">Sniper''s Mark</span>',NULL,3,3);
INSERT INTO "GuideStepPoint" VALUES (10,'If no <span class="dexterity">G</span>-<span class="dexterity">G</span>-<span class="dexterity">G</span> item yet, replace Momentum in links with Mirage Archer',NULL,3,4);
INSERT INTO "GuideStepPoint" VALUES (11,'Buy: <span class="dexterity">Pierce</span>',NULL,3,5);
INSERT INTO "GuideStepPoint" VALUES (12,'If possible, link <span class="dexterity">Pierce</span> to <span class="dexterity">Shrapnel Ballista</span>',NULL,3,6);
INSERT INTO "GuideStepPoint" VALUES (13,'Bridge across chasm: Flooded Depths will be before bridge',NULL,4,1);
INSERT INTO "GuideStepPoint" VALUES (14,'Go back to Submerged Passage and kill the Dweller of the Deep if you haven''t already',NULL,5,1);
INSERT INTO "GuideStepPoint" VALUES (15,'Do lab trial in Lower Prison',NULL,5,2);
INSERT INTO "GuideStepPoint" VALUES (16,'Buy if necessary: Longbow',NULL,6,1);
INSERT INTO "GuideStepPoint" VALUES (17,'Vendor recipe (Longbow with +% Increased Physical Damage):',NULL,6,2);
INSERT INTO "GuideStepPoint" VALUES (18,'Rustic Sash (Magic)',17,6,1);
INSERT INTO "GuideStepPoint" VALUES (19,'Longbow',17,6,2);
INSERT INTO "GuideStepPoint" VALUES (20,'Blacksmith''s Whetstone',17,6,3);
INSERT INTO "GuideStepPoint" VALUES (21,'Kill: Brutus',NULL,6,3);
INSERT INTO "GuideStepPoint" VALUES (22,'Quest reward: <span class="dexterity">Added Cold Damage Support</span>',NULL,7,1);
INSERT INTO "GuideStepPoint" VALUES (23,'Quest reward: <span class="dexterity">Blink Arrow</span>',NULL,7,2);
INSERT INTO "GuideStepPoint" VALUES (24,'Replace <span class="dexterity">Momentum Support</span> with <span class="dexterity">Added Cold Damage Support</span>',NULL,7,3);
INSERT INTO "GuideStepPoint" VALUES (25,'Replace <span class="dexterity">Dash</span> with <span class="dexterity">Blink Arrow</span>',NULL,7,4);
INSERT INTO "GuideStepPoint" VALUES (26,'Quest reward: <span class="dexterity">Rain of Arrows</span>',NULL,9,1);
INSERT INTO "GuideStepPoint" VALUES (27,'Replace <span class="dexterity">Galvanic Arrow</span> with <span class="dexterity">Rain of Arrows</span>',NULL,9,2);
INSERT INTO "GuideStepPoint" VALUES (28,'If you have a 3-link for <span class="dexterity">Shrapnel Ballista</span>, link it with <span class="dexterity">Added Cold Damage Support</span>',NULL,9,3);
INSERT INTO "GuideStepPoint" VALUES (29,'Vendor recipe if necessary (Sapphire Ring):',NULL,9,4);
INSERT INTO "GuideStepPoint" VALUES (31,'Iron Ring',29,9,1);
INSERT INTO "GuideStepPoint" VALUES (32,'<span class="intelligence">Intelligence</span> Skill Gem',29,9,2);
INSERT INTO "GuideStepPoint" VALUES (33,'Enemy at the Gate:',NULL,10,1);
INSERT INTO "GuideStepPoint" VALUES (34,'<span class="dexterity">Galvanic Arrow</span>, quest reward',33,10,1);
INSERT INTO "GuideStepPoint" VALUES (35,'Breaking Some Eggs:',NULL,10,2);
INSERT INTO "GuideStepPoint" VALUES (36,'<span class="dexterity">Shrapnel Ballista</span>, quest reward',35,10,1);
INSERT INTO "GuideStepPoint" VALUES (37,'<span class="dexterity">Dash</span>, quest reward',35,10,2);
INSERT INTO "GuideStepPoint" VALUES (38,'Mercy Mission:',NULL,10,3);
INSERT INTO "GuideStepPoint" VALUES (39,'<span class="dexterity">Mirage Archer</span>, quest reward',38,10,1);
INSERT INTO "GuideStepPoint" VALUES (40,'The Caged Brute:',NULL,10,4);
INSERT INTO "GuideStepPoint" VALUES (41,'<span class="dexterity">Added Cold Damage Support</span>, quest reward',40,10,1);
INSERT INTO "GuideStepPoint" VALUES (42,'<span class="dexterity">Precision</span>, buy from Nessa (1x Orb of Transmutation)',40,10,2);
INSERT INTO "GuideStepPoint" VALUES (43,'Quest reward: <span class="dexterity">Herald of Ice</span>',NULL,11,1);
INSERT INTO "GuideStepPoint" VALUES (44,'Ignore the lab trial in the Crypt',NULL,11,2);
INSERT INTO "GuideStepPoint" VALUES (45,'Can now craft 16-20% elemental resistance onto all gear',NULL,12,1);
INSERT INTO "GuideStepPoint" VALUES (46,'Make sure you have keystones:',NULL,12,2);
INSERT INTO "GuideStepPoint" VALUES (47,'Precise Technique (make sure SURE to have more accuracy than life!)',46,12,1);
INSERT INTO "GuideStepPoint" VALUES (48,'Point Blank',46,12,2);
INSERT INTO "GuideStepPoint" VALUES (49,'Kill: Vaal Overlord',NULL,12,3);
INSERT INTO "GuideStepPoint" VALUES (50,'Look out for 4 links, both drops and from Hargan',NULL,13,1);
INSERT INTO "GuideStepPoint" VALUES (51,'Ideal colours are <span class="dexterity">G</span>-<span class="dexterity">G</span>-<span class="intelligence">B</span>-<span class="strength">R</span> but <span class="dexterity">G</span>-<span class="dexterity">G</span>-<span class="dexterity">G</span>-<span class="strength">R</span> will work as well',NULL,13,2);
INSERT INTO "GuideStepPoint" VALUES (52,'Lab trial: Crematorium',NULL,13,3);
INSERT INTO "GuideStepPoint" VALUES (53,'Kill Piety',NULL,13,4);
INSERT INTO "GuideStepPoint" VALUES (54,'Quest reward: <span class="dexterity">Grace</span>',NULL,13,5);
INSERT INTO "GuideStepPoint" VALUES (55,'Buy from Nessa: <span class="dexterity">Sniper''s Mark</span>',NULL,13,6);
INSERT INTO "GuideStepPoint" VALUES (56,'Buy from Clarissa: <span class="strength">Anger</span>',NULL,13,7);
INSERT INTO "GuideStepPoint" VALUES (57,'Buy from Clarissa: <span class="dexterity">Haste</span>',NULL,13,8);
INSERT INTO "GuideStepPoint" VALUES (58,'Only run one of these auras - <span class="dexterity">Haste</span> = zoom, <span class="strength">Anger</span> = helps proccing Trinity, more DPS',NULL,13,9);
INSERT INTO "GuideStepPoint" VALUES (59,'Lab trial: Catacombs',NULL,14,1);
INSERT INTO "GuideStepPoint" VALUES (60,'T7 flat elemental damage rolls start appearing on bows of this item level. Look out for double rolls - will see you through act 5',NULL,15,1);
INSERT INTO "GuideStepPoint" VALUES (61,'Until then, use any good bow - the act 1 one will become worse fast. You can use essences or alchs on Bone Bow or Royal Bow bases',NULL,15,2);
INSERT INTO "GuideStepPoint" VALUES (62,'This is probably the earliest you can start using Trinity, even though it''s not actually expected until act 6',NULL,16,1);
INSERT INTO "GuideStepPoint" VALUES (63,'If you aren''t sure if you can use Trinity yet, check your main skill. It needs to do damage with at least 2 different elemental damage types (<span class="fire">Fire</span>, <span class="cold">Cold</span>, <span class="lightning">Lightning</span>)',NULL,16,2);
INSERT INTO "GuideStepPoint" VALUES (64,'The easiest way to get Trinity to proc is to have high Lightning damage on your bow since Lightning damage has a wide range',NULL,16,3);
INSERT INTO "GuideStepPoint" VALUES (65,'Kill: Gravicius',NULL,17,1);
INSERT INTO "GuideStepPoint" VALUES (66,'Quest reward: <span class="dexterity">Artillery Ballista</span>',NULL,17,2);
INSERT INTO "GuideStepPoint" VALUES (67,'If you have a 4-link for your ballista, you can set it up now. See the gem links column for optimal links',NULL,17,3);
INSERT INTO "GuideStepPoint" VALUES (68,'Lost in Love:',NULL,18,1);
INSERT INTO "GuideStepPoint" VALUES (69,'<span class="dexterity">Grace</span>, quest reward',68,18,1);
INSERT INTO "GuideStepPoint" VALUES (70,'<span class="dexterity">Sniper''s Anger''s Mark</span>, buy from Nessa (1x Scroll of Wisdom)',68,18,2);
INSERT INTO "GuideStepPoint" VALUES (71,'<span class="strength">Anger</span>, buy from Clarissa (1x Orb of Alteration)',68,18,3);
INSERT INTO "GuideStepPoint" VALUES (72,'<span class="dexterity">Haste</span>, buy from Clarissa (1x Orb of Alteration)',68,18,4);
INSERT INTO "GuideStepPoint" VALUES (73,'A Fixture of Fate:',NULL,18,2);
INSERT INTO "GuideStepPoint" VALUES (74,'<span class="dexterity">Focused Ballista Support</span>, quest reward, OPTIONAL',73,18,1);
INSERT INTO "GuideStepPoint" VALUES (75,'Buy from Petarus and Vanja: <span class="dexterity">Mark on Hit</span>',NULL,19,1);
INSERT INTO "GuideStepPoint" VALUES (76,'Link <span class="dexterity">Mark on Hit</span> to <span class="dexterity">Sniper''s Mark</span>',NULL,19,2);
INSERT INTO "GuideStepPoint" VALUES (77,'Quest reward: Jade Flask',NULL,20,1);
INSERT INTO "GuideStepPoint" VALUES (78,'Clear Twilight Strand for Lilly. This is the latest point at which you should get <span class="intelligence">Trinity</span>',NULL,21,1);
INSERT INTO "GuideStepPoint" VALUES (79,'Buy from Lilly: <span class="intelligence">Flame Dash</span>',NULL,21,2);
INSERT INTO "GuideStepPoint" VALUES (80,'Replace <span class="dexterity">Blink Arrow</span> with <span class="intelligence">Flame Dash</span>',NULL,21,3);
INSERT INTO "GuideStepPoint" VALUES (81,'Consider replacing your <span class="strength">Elemental Damage with Attacks Support</span> gems with <span class="strength">Inspiration</span>. Less damage, but the reduced mana cost adds a lot of QoL',NULL,21,4);
INSERT INTO "GuideStepPoint" VALUES (82,'You''ll also start getting Rogue Markers. Loot these, they''re important because they''ll let you do the Heist intro quest.',NULL,22,1);
INSERT INTO "GuideStepPoint" VALUES (83,'You''ll also start seeing Expeditions. Do the intro quests, you can get some great rewards early on - especially from Tujen, who will shower you with random currencies.',NULL,22,2);
INSERT INTO "GuideStepPoint" VALUES (84,'Quest reward: Granite Flask',NULL,23,1);
INSERT INTO "GuideStepPoint" VALUES (85,'You should be able to run <span class="dexterity">Grace</span>, <span class="strength">Anger</span>, and a level 1 <span class="dexterity">Precision</span> now',NULL,24,1);
INSERT INTO "GuideStepPoint" VALUES (86,'If you still can''t reliably run all 3, ignore Grace for now',NULL,24,2);
INSERT INTO "GuideStepPoint" VALUES (87,'As soon as you hit area level 51, you can start finding bows from monsters or vendors that are item level 51. This is a breakpoint item level that will let you craft tier 4 Elemental Damage mods',NULL,25,1);
INSERT INTO "GuideStepPoint" VALUES (88,'It''s a huge damage increase, so it''s a good way to get an update for your bow. A bow with a tier 4 lightning mod and at least 1 other elemental damage mod will probably last you through the campaign',NULL,25,2);
INSERT INTO "GuideStepPoint" VALUES (89,'You can also start buying lockpicking and demolition contracts at the Rogue Harbour. They will cost you either chances or alchs',NULL,26,1);
INSERT INTO "GuideStepPoint" VALUES (90,'The lockpicking contracts will provide you with chances and alchs, and the demolition contracts will have quest mark (wildcard) reward room chest which drop chaos orbs all the time',NULL,26,2);
INSERT INTO "GuideStepPoint" VALUES (91,'Three possible layouts for this zone:',NULL,27,1);
INSERT INTO "GuideStepPoint" VALUES (92,'If you hit a cliff immediately, it''s in the top right, so follow the cliff around until the wall straight ahead opens up, then follow wall',91,27,1);
INSERT INTO "GuideStepPoint" VALUES (93,'If the centre is blocked, it''s in the centre, so go around the wall and back through',91,27,2);
INSERT INTO "GuideStepPoint" VALUES (94,'If you can go straight through the middle, it''s in the top left',91,27,3);
INSERT INTO "GuideStepPoint" VALUES (95,'Before you finish Act 10, take a look at your gear. You should aim for:',NULL,28,1);
INSERT INTO "GuideStepPoint" VALUES (96,'105% of each elemental resistance',95,28,1);
INSERT INTO "GuideStepPoint" VALUES (97,'Enough of each elemental damage to let you proc Trinity',95,28,2);
INSERT INTO "GuideStepPoint" VALUES (98,'More accuracy rating than life',95,28,3);
INSERT INTO "GuideStepPoint" VALUES (99,'A decent amount of life, at least 2.5k and preferably 3k',95,28,4);
INSERT INTO "GuideStepPoint" VALUES (100,'Enough sockets and links for all your skills (except Guard skills, which can wait)',95,28,5);
INSERT INTO "GuideStepPoint" VALUES (101,'Remember to do merc lab if it''s trivial, but don''t bother yet if there''s too high a risk of death - it''s really slow and wastes a lot of time',NULL,28,2);
INSERT INTO "GuideStepPoint" VALUES (102,'Before killing Kitava, you can do the Heist missions you''ve picked up during the campaign',NULL,28,3);
INSERT INTO "GuideStep" VALUES (1,'Enemy at the Gates','QUEST',1,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (2,'Submerged Passage','WAYPOINT',1,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (3,'Mercy Mission','QUEST',1,3,'roa-warden');
INSERT INTO "GuideStep" VALUES (4,'Submerged Passage','CONTINUE',1,4,'roa-warden');
INSERT INTO "GuideStep" VALUES (5,'Lower Prison','WAYPOINT',1,5,'roa-warden');
INSERT INTO "GuideStep" VALUES (6,'9','LEVEL',1,6,'roa-warden');
INSERT INTO "GuideStep" VALUES (7,'Prisoner''s Gate','WAYPOINT',1,7,'roa-warden');
INSERT INTO "GuideStep" VALUES (9,'Cavern of Wrath','WAYPOINT',1,8,'roa-warden');
INSERT INTO "GuideStep" VALUES (10,'Gems','OVERVIEW',1,9,'roa-warden');
INSERT INTO "GuideStep" VALUES (11,'Intruders in Black','QUEST',2,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (12,'20','LEVEL',2,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (13,'Links','BEGINNING',3,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (14,'The Marketplace','ZONE',3,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (15,'27','LEVEL',3,3,'roa-warden');
INSERT INTO "GuideStep" VALUES (16,'Trinity','GEM',3,4,'roa-warden');
INSERT INTO "GuideStep" VALUES (17,'The Ebony Barracks','ZONE',3,5,'roa-warden');
INSERT INTO "GuideStep" VALUES (18,'Gems','OVERVIEW',3,6,'roa-warden');
INSERT INTO "GuideStep" VALUES (19,'38','LEVEL',4,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (20,'The Key to Freedom','QUEST',5,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (21,'Twilight Strand','BEGINNING',6,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (22,'Rogue Markers & Expedition','BEGINNING',6,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (23,'The Silver Locket','QUEST',7,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (24,'Auras','GEM',7,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (25,'51','LEVEL',7,3,'roa-warden');
INSERT INTO "GuideStep" VALUES (26,'Rogue Harbour','ZONE',7,4,'roa-warden');
INSERT INTO "GuideStep" VALUES (27,'The Vaal City','ZONE',7,5,'roa-warden');
INSERT INTO "GuideStep" VALUES (28,'Gear','OVERVIEW',10,1,'roa-warden');
INSERT INTO "GemLink" VALUES (1,1,'roa-warden');
INSERT INTO "GemLink" VALUES (2,1,'roa-warden');
INSERT INTO "GemLink" VALUES (3,1,'roa-warden');
INSERT INTO "GemLink" VALUES (4,1,'roa-warden');
INSERT INTO "GemLink" VALUES (5,2,'roa-warden');
INSERT INTO "GemLink" VALUES (6,2,'roa-warden');
INSERT INTO "GemLink" VALUES (7,2,'roa-warden');
INSERT INTO "GemLink" VALUES (8,2,'roa-warden');
INSERT INTO "GemLink" VALUES (9,2,'roa-warden');
INSERT INTO "GemLink" VALUES (10,2,'roa-warden');
INSERT INTO "GemLink" VALUES (11,2,'roa-warden');
INSERT INTO "GemLink" VALUES (12,3,'roa-warden');
INSERT INTO "GemLink" VALUES (13,3,'roa-warden');
INSERT INTO "GemLink" VALUES (14,3,'roa-warden');
INSERT INTO "GemLink" VALUES (15,3,'roa-warden');
INSERT INTO "GemLink" VALUES (16,3,'roa-warden');
INSERT INTO "GemLink" VALUES (17,3,'roa-warden');
INSERT INTO "GemLink" VALUES (19,4,'roa-warden');
INSERT INTO "GemLink" VALUES (20,4,'roa-warden');
INSERT INTO "GemLink" VALUES (21,4,'roa-warden');
INSERT INTO "GemLink" VALUES (22,4,'roa-warden');
INSERT INTO "GemLink" VALUES (23,4,'roa-warden');
INSERT INTO "GemLink" VALUES (24,4,'roa-warden');
INSERT INTO "GemLink" VALUES (26,6,'roa-warden');
INSERT INTO "GemLink" VALUES (27,6,'roa-warden');
INSERT INTO "GemLink" VALUES (28,6,'roa-warden');
INSERT INTO "GemLink" VALUES (29,6,'roa-warden');
INSERT INTO "GemLink" VALUES (30,6,'roa-warden');
INSERT INTO "GemLink" VALUES (31,6,'roa-warden');
INSERT INTO "GemLink" VALUES (32,6,'roa-warden');
INSERT INTO "GemLink" VALUES (33,7,'roa-warden');
INSERT INTO "GemLink" VALUES (34,7,'roa-warden');
INSERT INTO "GemLink" VALUES (35,7,'roa-warden');
INSERT INTO "GemLink" VALUES (36,7,'roa-warden');
INSERT INTO "GemLink" VALUES (37,7,'roa-warden');
INSERT INTO "GemLink" VALUES (38,7,'roa-warden');
INSERT INTO "GemLink" VALUES (39,7,'roa-warden');
INSERT INTO "TargetLevel" VALUES (1,1,'roa-warden','4','Hailrake');
INSERT INTO "TargetLevel" VALUES (2,1,'roa-warden','8-10','Brutus');
INSERT INTO "TargetLevel" VALUES (3,1,'roa-warden','11-13','Merveil');
INSERT INTO "TargetLevel" VALUES (4,2,'roa-warden','14-15','Fidelitas');
INSERT INTO "TargetLevel" VALUES (5,2,'roa-warden','16','Weaver');
INSERT INTO "TargetLevel" VALUES (6,2,'roa-warden','20-22','Vaal Oversoul');
INSERT INTO "TargetLevel" VALUES (7,3,'roa-warden','24','Docks');
INSERT INTO "TargetLevel" VALUES (8,3,'roa-warden','27','Piety');
INSERT INTO "TargetLevel" VALUES (9,3,'roa-warden','28','Dominus');
INSERT INTO "TargetLevel" VALUES (10,3,'roa-warden','28-29','Early lab');
INSERT INTO "TargetLevel" VALUES (11,4,'roa-warden','30-31','Dried Lake');
INSERT INTO "TargetLevel" VALUES (12,4,'roa-warden','31','Regular lab');
INSERT INTO "TargetLevel" VALUES (13,4,'roa-warden','34-35','Malachai');
INSERT INTO "TargetLevel" VALUES (14,9,'roa-warden','54','Enter Blood Aqueduct');
INSERT INTO "TargetLevel" VALUES (15,9,'roa-warden','58','Leave act if strong');
INSERT INTO "TargetLevel" VALUES (16,9,'roa-warden','60','Leave act if average');
INSERT INTO "TargetLevel" VALUES (17,9,'roa-warden','62','Leave act if weak');
INSERT INTO "ZoneMap" VALUES (1,1,'The Coast','a1_coast',1);
INSERT INTO "ZoneMap" VALUES (2,1,'The Mud Flats','a1_mudflats',2);
INSERT INTO "ZoneMap" VALUES (3,1,'The Submerged Passage','a1_submergedpassage',3);
INSERT INTO "ZoneMap" VALUES (4,1,'The Flooded Depths','a1_floodeddepths',4);
INSERT INTO "ZoneMap" VALUES (5,1,'The Climb','a1_climb',5);
INSERT INTO "ZoneMap" VALUES (6,1,'The Lower Prison','a1_lowerprison',6);
INSERT INTO "ZoneMap" VALUES (7,1,'The Upper Prison','a1_upperprison',7);
INSERT INTO "ZoneMap" VALUES (8,1,'The Prisoner''s Gate','a1_prisonersgate',8);
INSERT INTO "ZoneMap" VALUES (9,1,'The Ship Graveyard','a1_shipgraveyard',9);
INSERT INTO "ZoneMap" VALUES (10,1,'The Cavern of Wrath','a1_cavernofwrath',10);
INSERT INTO "ZoneMap" VALUES (11,1,'The Cavern of Anger','a1_cavernofanger',11);
INSERT INTO "ZoneMap" VALUES (12,2,'The Chamber of Sins 1','a2_chamberofsins1',1);
INSERT INTO "ZoneMap" VALUES (13,2,'The Chamber of Sins 2','a2_chamberofsins2',2);
INSERT INTO "ZoneMap" VALUES (14,2,'The Weaver''s Chambers','a2_weaverschambers',3);
INSERT INTO "ZoneMap" VALUES (15,2,'The Wetlands','a2_wetlands',4);
INSERT INTO "ZoneMap" VALUES (16,2,'The Vaal Ruins','a2_vaalruins',5);
INSERT INTO "ZoneMap" VALUES (17,2,'The Caverns','a2_caverns',6);
INSERT INTO "ZoneMap" VALUES (30,3,'The Slums','a3_slums',1);
INSERT INTO "ZoneMap" VALUES (31,3,'The Crematorium','a3_crematorium',2);
INSERT INTO "ZoneMap" VALUES (32,3,'The Sewers','a3_sewers',3);
INSERT INTO "ZoneMap" VALUES (33,3,'The Marketplace','a3_marketplace',4);
INSERT INTO "ZoneMap" VALUES (34,3,'The Battlefront','a3_battlefront',5);
INSERT INTO "ZoneMap" VALUES (35,3,'The Docks','a3_docks',6);
INSERT INTO "ZoneMap" VALUES (36,3,'The Solaris Temple 1','a3_solaristemple1',7);
INSERT INTO "ZoneMap" VALUES (37,3,'The Solaris Temple 2','a3_solaristemple2',8);
INSERT INTO "ZoneMap" VALUES (38,3,'The Ebony Barracks','a3_ebonybarracks',9);
INSERT INTO "ZoneMap" VALUES (39,3,'The Lunaris Temple 1','a3_lunaristemple1',10);
INSERT INTO "ZoneMap" VALUES (40,3,'The Lunaris Temple 2','a3_lunaristemple2',11);
INSERT INTO "ZoneMap" VALUES (41,3,'The Imperial Gardens','a3_imperialgardens',12);
INSERT INTO "ZoneMap" VALUES (42,4,'The Dried Lake','a4_driedlake',1);
INSERT INTO "ZoneMap" VALUES (43,4,'The Mines 1','a4_mines1',2);
INSERT INTO "ZoneMap" VALUES (44,4,'The Mines 2','a4_mines2',3);
INSERT INTO "ZoneMap" VALUES (45,4,'The Crystal Veins','a4_crystalveins',4);
INSERT INTO "ZoneMap" VALUES (46,4,'Kaom''s Dream','a4_kaomsdream',5);
INSERT INTO "ZoneMap" VALUES (47,4,'Kaom''s Stronghold','a4_kaomsstronghold',6);
INSERT INTO "ZoneMap" VALUES (48,4,'The Belly of the Beast 1','a4_bellyofthebeast1',7);
INSERT INTO "ZoneMap" VALUES (49,4,'The Belly of the Beast 2','a4_bellyofthebeast2',8);
INSERT INTO "ZoneMap" VALUES (50,4,'The Harvest','a4_harvest',9);
INSERT INTO "ZoneMap" VALUES (51,4,'The Ascent','a4_ascent',10);
INSERT INTO "ZoneMap" VALUES (52,5,'The Slave Pens','a5_slavepens',1);
INSERT INTO "ZoneMap" VALUES (53,5,'The Control Blocks','a5_controlblocks',2);
INSERT INTO "ZoneMap" VALUES (54,5,'Oriath Square','a5_oriathsquare',3);
INSERT INTO "ZoneMap" VALUES (55,5,'The Templar Courts','a5_templarcourts',4);
INSERT INTO "ZoneMap" VALUES (56,5,'Chamber of Innocence','a5_chamberofinnocence',5);
INSERT INTO "ZoneMap" VALUES (57,5,'The Torched Courts','a5_torchedcourts',6);
INSERT INTO "ZoneMap" VALUES (58,5,'The Ruined Square','a5_ruinesquare',7);
INSERT INTO "ZoneMap" VALUES (59,5,'The Ossuary','a5_ossuary',8);
INSERT INTO "ZoneMap" VALUES (60,5,'The Reliquary','a5_reliquary',9);
INSERT INTO "ZoneMap" VALUES (61,6,'The Coast','a6_coast',1);
INSERT INTO "ZoneMap" VALUES (62,6,'The Mud Flats','a6_mudflats',2);
INSERT INTO "ZoneMap" VALUES (63,6,'The Karui Fortress','a6_karuifortress',3);
INSERT INTO "ZoneMap" VALUES (64,6,'The Ridge','a6_ridge',4);
INSERT INTO "ZoneMap" VALUES (65,6,'The Lower Prison','a6_lowerprison',5);
INSERT INTO "ZoneMap" VALUES (66,6,'Prisoner''s Gate','a6_prisonersgate',6);
INSERT INTO "ZoneMap" VALUES (67,6,'The Riverways','a6_riverways',7);
INSERT INTO "ZoneMap" VALUES (68,6,'The Cavern of Anger','a6_cavernofanger',8);
INSERT INTO "ZoneMap" VALUES (69,6,'The Brine King’s Reef','a6_brinekingsreef',9);
INSERT INTO "ZoneMap" VALUES (70,7,'The Crossroads','a7_crossroads',1);
INSERT INTO "ZoneMap" VALUES (71,7,'The Crypt 1','a7_crypt1',2);
INSERT INTO "ZoneMap" VALUES (72,7,'The Crypt 2','a7_crypt2',3);
INSERT INTO "ZoneMap" VALUES (73,7,'The Chamber of Sins 1','a7_chamberofsins1',4);
INSERT INTO "ZoneMap" VALUES (74,7,'The Chamber of Sins 2','a7_chamberofsins2',5);
INSERT INTO "ZoneMap" VALUES (75,7,'The Den','a7_den',6);
INSERT INTO "ZoneMap" VALUES (76,7,'The Vaal City','a7_vaalcity',7);
INSERT INTO "ZoneMap" VALUES (77,8,'The Toxic Conduits','a8_toxicconduits1',1);
INSERT INTO "ZoneMap" VALUES (78,8,'Doedre’s Cesspool','a8_doedrescesspool',2);
INSERT INTO "ZoneMap" VALUES (79,8,'The Toxic Conduits (Waypoint)','a8_toxicconduits2',3);
INSERT INTO "ZoneMap" VALUES (80,8,'The Quay','a8_quay',4);
INSERT INTO "ZoneMap" VALUES (81,8,'The Grain Gate','a8_graingate',5);
INSERT INTO "ZoneMap" VALUES (82,8,'Solaris Temple 1','a8_solaristemple1',6);
INSERT INTO "ZoneMap" VALUES (83,8,'Solaris Temple 2','a8_solaristemple2',7);
INSERT INTO "ZoneMap" VALUES (84,8,'The Bath House','a8_bathhouse',8);
INSERT INTO "ZoneMap" VALUES (85,8,'The Lunaris Concourse','a8_lunarisconcourse',9);
INSERT INTO "ZoneMap" VALUES (86,8,'The Lunaris Temple 1','a8_lunaristemple1',10);
INSERT INTO "ZoneMap" VALUES (87,8,'The Lunaris Temple 2','a8_lunaristemple2',11);
INSERT INTO "ZoneMap" VALUES (88,9,'The Descent','a9_descent',1);
INSERT INTO "ZoneMap" VALUES (89,9,'The Vastiri Desert','a9_vastiridesert',2);
INSERT INTO "ZoneMap" VALUES (90,9,'The Oasis','a9_oasis',3);
INSERT INTO "ZoneMap" VALUES (91,9,'The Foothills','a9_foothills',4);
INSERT INTO "ZoneMap" VALUES (92,9,'The Tunnel','a9_tunnel',5);
INSERT INTO "ZoneMap" VALUES (93,9,'The Quarry','a9_quarry',6);
INSERT INTO "ZoneMap" VALUES (94,9,'The Refinery','a9_refinery',7);
INSERT INTO "ZoneMap" VALUES (95,9,'The Belly of the Beast','a9_bellyofthebeast',8);
INSERT INTO "ZoneMap" VALUES (96,10,'The Ravaged Square','a10_ravagedsquare',1);
INSERT INTO "User" VALUES (1,'test','''24??&??:??????7O?|??6d?#?j?s?0Q@2??OI???n?T?w?B??YZ??&?;m?*y???P?;?zH>?R???x???j? ????s????????"?L???\? ????Y?"SH?[?','bazqux');
INSERT INTO "User" VALUES (3,'admin','qQQgrYBTQ7QLLuzl+WiVkfciL6Sj6wTV2rMJtky9fs8nSEVghTxPp3/TvjSgKKI4ImrtAt/4coic3TP4+aMhohgD5ontxMPJEG7ak1nGKJu6lD2Zl0XA9xQ9hw90y1BQ454FweYcB7ZlAvoGCxE8G18mbc/Di2NK9pEUCVR1CQDOplBktSS7LrVIjpgYaYVK2qTPFM/y/5vJFigzMC6Oa0o6rCpeCgry0jRzZUS0DIKQpzIH7iwgf6uFxZYyef5iKWcenYwG3r+xk6ZrF7Ory8kfIUQgBLaEU02JVjpXKe+d+CMe374DJ4e1TBWkzFhMpCZGkrt1GYTfafDhUMqJ6PvZPR5P2EgF8HoyBDC8o0qNFbFhh0SzA3+FEwV8Z27BiyF6EROYIYQA71QtLstCcgF//MZkz6ET9UBKYuPRmbwt0yfh2WLBZSmH8lZCDszSPHOeGim6z4nTcV11CuSizOk2/BNHyqzVBrNE84vhAkC4D3exGmrNOGfKPiLi405ti3sfkeVEgD9lbDmScvD7UDuvqqcrZLdeeN81zYT/R5SJ9JeYlg4q8WXvXY/QIvTMLTmmOtYvgpFVe6Iv4pecaBJQ1j//HPbM+aKckvnUNwRgxlDf/m6vjtU31jeWi6FQI4ImYE6G5iUEY8J7uCWSmvkzZl4Vn/pTlexi8YjiQNw=','dNBa831LZo+SoAALSiCQv3P11M6BwopFRPsl328XgqY=');
COMMIT;
