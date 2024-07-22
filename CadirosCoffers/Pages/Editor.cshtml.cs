using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using CadirosCoffers.Services.GuideService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CadirosCoffers.Pages
{
    [Authorize]
    [IgnoreAntiforgeryToken(Order = 10001)]
    public class EditorModel : BaseViewModel
    {
        private readonly ILogger<EditorModel> _logger;
        private readonly IConfiguration _configuration;

        private readonly DatabaseOptions _databaseOptions;

        private readonly BuildsRepository _buildsRepository;

        public EditorModel(ILogger<EditorModel> logger, IConfiguration configuration)
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

        public IActionResult OnGetBuild(string buildId)
        {
            GuideBuilder builder = new(_databaseOptions, buildId);
            Guide guide = builder.BuildGuide();

            return new JsonResult(guide);
        }

        public IActionResult OnPostNewBuild(NewBuildPostViewModel newBuild)
        {
            _buildsRepository.CreateNewBuild(newBuild.Id, newBuild.Name, newBuild.Version);

            return RedirectToPage("/Editor");
        }
    }

    public class NewBuildPostViewModel
    {
        public string Id { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Version { get; set; } = String.Empty;
    }
}
