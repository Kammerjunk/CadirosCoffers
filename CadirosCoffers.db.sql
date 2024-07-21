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
	FOREIGN KEY("AttributeId") REFERENCES "Attribute"("AttributeId"),
	FOREIGN KEY("GemLinkId") REFERENCES "GemLink"("GemLinkId"),
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
	PRIMARY KEY("TargetLevelId" AUTOINCREMENT),
	FOREIGN KEY("BuildId") REFERENCES "Build"("BuildId")
);
CREATE TABLE IF NOT EXISTS "ZoneMap" (
	"ZoneMapId"	INTEGER NOT NULL UNIQUE,
	"Act"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"FileName"	TEXT NOT NULL,
	"ZoneIndex"	INTEGER NOT NULL,
	PRIMARY KEY("ZoneMapId" AUTOINCREMENT)
);
INSERT INTO "Build" VALUES ('roa-warden','RoA Warden','3.25');
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
INSERT INTO "GuideStepPoint" VALUES (16,'Buy if necessary: Longbow',NULL,5,1);
INSERT INTO "GuideStepPoint" VALUES (17,'Vendor recipe (Longbow with +% Increased Physical Damage):',NULL,5,2);
INSERT INTO "GuideStepPoint" VALUES (18,'Rustic Sash (Magic)',17,5,1);
INSERT INTO "GuideStepPoint" VALUES (19,'Longbow',17,5,2);
INSERT INTO "GuideStepPoint" VALUES (20,'Blacksmith''s Whetstone',17,5,3);
INSERT INTO "GuideStepPoint" VALUES (21,'Kill: Brutus',NULL,5,3);
INSERT INTO "GuideStep" VALUES (1,'Enemy at the Gates','QUEST',1,1,'roa-warden');
INSERT INTO "GuideStep" VALUES (2,'Submerged Passage','WAYPOINT',1,2,'roa-warden');
INSERT INTO "GuideStep" VALUES (3,'Mercy Mission','QUEST',1,3,'roa-warden');
INSERT INTO "GuideStep" VALUES (4,'Submerged Passage','CONTINUE',1,4,'roa-warden');
INSERT INTO "GuideStep" VALUES (5,'Lower Prison','WAYPOINT',1,5,'roa-warden');
INSERT INTO "GuideStep" VALUES (6,'9','LEVEL',1,6,'roa-warden');
INSERT INTO "GemLink" VALUES (1,1,'roa-warden');
INSERT INTO "GemLink" VALUES (2,1,'roa-warden');
INSERT INTO "GemLink" VALUES (3,1,'roa-warden');
INSERT INTO "GemLink" VALUES (4,1,'roa-warden');
INSERT INTO "TargetLevel" VALUES (1,1,'roa-warden','4','Hailrake');
INSERT INTO "TargetLevel" VALUES (2,1,'roa-warden','8-10','Brutus');
INSERT INTO "TargetLevel" VALUES (3,1,'roa-warden','11-13','Merveil');
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
COMMIT;
