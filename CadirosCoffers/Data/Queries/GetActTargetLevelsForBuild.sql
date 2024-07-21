SELECT
	TargetLevelId
	, Level
	, Progress
FROM TargetLevel
WHERE
	Act = @ActNumber
	AND BuildId = @BuildId
ORDER BY TargetLevelId