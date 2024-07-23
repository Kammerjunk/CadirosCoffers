UPDATE GuideStepPoint
SET
	StepPointIndex = @Index
WHERE
	GuideStepPointId = @PointId
;