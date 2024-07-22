using Microsoft.AspNetCore.Identity;

namespace CadirosCoffers.Model
{
    public class User(string userName, string passwordHash, string salt)
    {
        public string UserName { get; set; } = userName;
        public string PasswordHash { get; set; } = passwordHash;
        public string Salt { get; set; } = salt;
    }
}
