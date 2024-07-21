using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using CadirosCoffers.Services.GuideService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Linq;

namespace CadirosCoffers.Pages
{
    public class IndexModel : BaseViewModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IConfiguration _configuration;

        private readonly DatabaseOptions _databaseOptions;

        private readonly BuildsRepository _buildsRepository;

        public IndexModel(ILogger<IndexModel> logger, IConfiguration configuration)
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

        public IActionResult OnGetCampaignMap()
        {
            CampaignMapBuilder builder = new(_databaseOptions);
            CampaignMap campaign = builder.BuildMaps();

            return new JsonResult(campaign);
        }

        public IActionResult OnGetBuild(string buildId)
        {
            GuideBuilder builder = new(_databaseOptions, buildId);
            Guide guide = builder.BuildGuide();

            return new JsonResult(guide);
        }
    }
}
