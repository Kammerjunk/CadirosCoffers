SELECT
	Name
	, FileName
	, ZoneIndex
FROM ZoneMap
WHERE
	Act = @ActNumber
ORDER BY ZoneIndex