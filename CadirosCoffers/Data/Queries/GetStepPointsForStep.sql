SELECT
	GuideStepPointId AS StepPointId
	, ParentPoint AS ParentPointId
	, StepPointIndex
	, Text
FROM GuideStepPoint stepPoint
WHERE
	StepId = @StepId
ORDER BY StepPointIndex