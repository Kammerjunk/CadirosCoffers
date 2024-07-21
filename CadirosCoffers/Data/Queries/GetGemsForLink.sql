SELECT
	g.GemId
	, g.Name
	, a.Name AS Attribute
	, g.Active
	, g.MaxLevel
FROM Gem g
INNER JOIN Attribute a ON a.AttributeId = g.AttributeId
WHERE
	GemLinkId = @GemLinkId
ORDER BY GemId