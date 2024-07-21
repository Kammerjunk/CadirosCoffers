SELECT
	step.GuideStepId AS StepId
	, step.ActStepIndex AS StepIndex
	, cat.Text AS Category
	, step.Name
FROM GuideStep step
INNER JOIN GuideStepCategory cat ON cat.CategoryId = step.Category
WHERE
	step.BuildId = @BuildId
	AND step.Act = @ActNumber
ORDER BY ActStepIndex