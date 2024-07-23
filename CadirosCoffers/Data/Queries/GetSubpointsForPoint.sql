SELECT
	GuideStepPointId AS StepPointId
	, ParentPoint AS ParentPointId
	, StepPointIndex
	, Text
FROM GuideStepPoint stepPoint
WHERE
	ParentPoint = @PointId
ORDER BY StepPointIndex