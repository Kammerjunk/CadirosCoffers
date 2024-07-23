SELECT
	COALESCE(MAX(ActStepIndex)+1, 1)
FROM GuideStep
WHERE
	BuildId = @BuildId
	AND Act = @ActNumber
;