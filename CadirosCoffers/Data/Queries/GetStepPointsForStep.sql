SELECT
	GuideStepPointId AS StepPointId
	, ParentPoint AS ParentPointId
	, StepPointIndex
	, Text
FROM GuideStepPoint stepPoint
WHERE
	StepId = @StepId
	AND ParentPoint IS NULL
ORDER BY StepPointIndex