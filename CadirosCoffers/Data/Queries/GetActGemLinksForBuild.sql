SELECT
	GemLinkId
FROM GemLink
WHERE
	Act = @ActNumber
	AND BuildId = @BuildId