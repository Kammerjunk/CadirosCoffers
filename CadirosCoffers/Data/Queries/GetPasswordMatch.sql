SELECT
	Password = @Hash AS Match
FROM User
WHERE
	Username = @Username