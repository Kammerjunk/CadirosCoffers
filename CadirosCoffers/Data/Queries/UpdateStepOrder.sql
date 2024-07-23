UPDATE GuideStep
SET
	ActStepIndex = @Index
WHERE
	GuideStepId = @StepId
;