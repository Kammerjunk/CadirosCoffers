UPDATE TargetLevel
SET
	  Level = @Level
	, Progress = @Progress
WHERE
	TargetLevelId = @TargetLevelId
;