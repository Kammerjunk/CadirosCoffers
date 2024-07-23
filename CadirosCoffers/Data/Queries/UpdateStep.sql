UPDATE GuideStep
SET
	Category = @Category
	, [Name] = @Name
	
WHERE
	GuideStepId = @StepId
;