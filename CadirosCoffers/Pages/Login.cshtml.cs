using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        private readonly AuthOptions _authenticationOptions;

        private readonly BuildsRepository _buildsRepository;

        public LoginModel(ILogger<LoginModel> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

            _databaseOptions = new DatabaseOptions();
            _configuration.GetSection(DatabaseOptions.Database).Bind(_databaseOptions);

            _authenticationOptions = new AuthOptions();
            _configuration.GetSection(AuthOptions.Authentication).Bind(_authenticationOptions);

            _buildsRepository = new(_databaseOptions);
        }

        public void OnGet()
        {
            AvailableBuilds = _buildsRepository.GetAvailableBuilds();
        }

        public async Task<IActionResult> OnPost(LoginPostViewModel loginPostViewModel)
        {
            string username = loginPostViewModel.Username;
            string password = loginPostViewModel.Password;

            string salt = _buildsRepository.GetSaltForUser(username);
            byte[] salty = Convert.FromBase64String(salt);

            byte[] hashed = Rfc2898DeriveBytes.Pbkdf2(password, salty, 100000, HashAlgorithmName.SHA512, 512);
            string hash = Convert.ToBase64String(hashed);

            bool passwordMatch = _buildsRepository.GetPasswordMatch(username, hash);

            if (passwordMatch)
            {
                User user = new User(username, hash, salt);
                List<Claim> claims =
                [
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.Role, "Administrator")
                ];

                ClaimsIdentity claimsIdentity = new(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                AuthenticationProperties authProperties = new()
                {
                    AllowRefresh = true,
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddDays(1),
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties
                );

                var asdf = HttpContext.Request.Path;

                if (loginPostViewModel.Path != null)
                {
                    string redirect = loginPostViewModel.Path.Split("=%2F").Last();
                    return RedirectToPage(redirect);
                }
                else
                {
                    return RedirectToPage("Index");
            }
        }

            return new JsonResult(0);
        }

    }

    public class LoginPostViewModel
    {
        public string Username { get; set; } = String.Empty;
        public string Password { get; set; } = String.Empty;
        public string? Path { get; set; } = String.Empty;
    }
}
