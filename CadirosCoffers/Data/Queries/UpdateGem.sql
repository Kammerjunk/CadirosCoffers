UPDATE Gem
SET
	  Name = @Name
	, Active = @Active
	, MaxLevel = @MaxLevel
	, AttributeId = @AttributeId
WHERE
	GemId = @GemId