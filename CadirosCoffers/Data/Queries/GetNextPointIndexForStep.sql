SELECT
	COALESCE(MAX(StepPointIndex)+1, 1)
FROM GuideStepPoint
WHERE
	StepId = @StepId
	AND ParentPoint IS NULL
;