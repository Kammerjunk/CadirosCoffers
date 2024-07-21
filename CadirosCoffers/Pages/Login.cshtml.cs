using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.Cryptography;
using System.Text;

namespace CadirosCoffers.Pages
{
    [IgnoreAntiforgeryToken(Order = 10001)]
    public class LoginModel : BaseViewModel
    {
        private readonly ILogger<LoginModel> _logger;
        private readonly IConfiguration _configuration;

        private readonly DatabaseOptions _databaseOptions;

        private readonly BuildsRepository _buildsRepository;

        public LoginModel(ILogger<LoginModel> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

            _databaseOptions = new DatabaseOptions();
            _configuration.GetSection(DatabaseOptions.Database).Bind(_databaseOptions);

            _buildsRepository = new(_databaseOptions);
        }

        public void OnGet()
        {
            AvailableBuilds = _buildsRepository.GetAvailableBuilds();
        }

        public IActionResult OnPost([FromBody]LoginPostViewModel loginPostViewModel)
        {
            string username = loginPostViewModel.Username;
            string password = loginPostViewModel.Password;

            string salt = _buildsRepository.GetSaltForUser(username);
            byte[] salty = Convert.FromBase64String(salt);

            byte[] hashed = Rfc2898DeriveBytes.Pbkdf2(password, salty, 100000, HashAlgorithmName.SHA512, 512);
            string hash = Convert.ToBase64String(hashed);

            bool passwordMatch = _buildsRepository.GetPasswordMatch(username, hash);

            return new JsonResult(passwordMatch);
        }

    }
    public record struct LoginPostViewModel(string Username, string Password);
}
