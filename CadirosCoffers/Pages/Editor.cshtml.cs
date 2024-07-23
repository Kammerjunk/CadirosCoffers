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

        public IActionResult OnGetStepCategories()
        {
            return new JsonResult(_buildsRepository.GetStepCategories());
        }

        public IActionResult OnGetAttributes()
        {
            return new JsonResult(_buildsRepository.GetAttributes());
        }

        public IActionResult OnGetBuild(string buildId)
        {
            GuideBuilder builder = new(_databaseOptions, buildId);
            Guide guide = builder.BuildGuide();

            return new JsonResult(guide);
        }

        public IActionResult OnGetAct(string buildId, int actNumber)
        {
            StrippedBuilder builder = new(_databaseOptions);
            Act act = builder.BuildAct(buildId, actNumber);

            return new JsonResult(act);
        }

        public IActionResult OnGetStep(int stepId)
        {
            StrippedBuilder builder = new(_databaseOptions);
            Step step = builder.BuildStep(stepId);

            return new JsonResult(step);
        }

        public IActionResult OnGetPoint(int pointId)
        {
            StrippedBuilder builder = new(_databaseOptions);
            StepPoint point = builder.BuildPoint(pointId);

            return new JsonResult(point);
        }

        public IActionResult OnGetLinks(string buildId, int actNumber)
        {
            IEnumerable<GemLink> links = _buildsRepository.GetActGemLinksForBuild(buildId, actNumber);
            return new JsonResult(links);
        }

        public IActionResult OnGetGems(long linkId)
        {
            IEnumerable<Gem> gems = _buildsRepository.GetGemsForLink(linkId);
            return new JsonResult(gems);
        }

        public IActionResult OnGetTargetLevels(string buildId, int actNumber)
        {
            IEnumerable<TargetLevel> targets = _buildsRepository.GetActTargetLevelsForBuild(buildId, actNumber);
            return new JsonResult(targets);
        }

        public IActionResult OnPostNewBuild(NewBuildPostViewModel newBuild)
        {
            _buildsRepository.CreateNewBuild(newBuild.Id, newBuild.Name, newBuild.Version);

            return RedirectToPage("/Editor");
        }

        public IActionResult OnPostStep([FromBody] StepPostViewModel step)
        {
            int stepIndex = _buildsRepository.GetNextStepIndexForBuildAct(step.BuildId, step.ActNumber);
            _buildsRepository.CreateStep(step.BuildId, step.ActNumber, step.Category, step.Name, stepIndex);

            return new OkResult();
        }

        public IActionResult OnPostPoint([FromBody] PointPostViewModel point)
        {
            int pointIndex;
            if (point.ParentId == null)
            {
                pointIndex = _buildsRepository.GetNextPointIndexForStep(point.StepId);
            }
            else
            {
                pointIndex = _buildsRepository.GetNextSubpointIndexForStep(point.StepId, (int)point.ParentId);
            }

            _buildsRepository.CreatePoint(point.StepId, point.ParentId, point.Text, pointIndex);

            return new OkResult();
        }

        public IActionResult OnPostLink([FromBody] LinkPostViewModel link)
        {
            _buildsRepository.CreateLink(link.BuildId, link.ActNumber);

            return new OkResult();
        }

        public IActionResult OnPostGem([FromBody] GemPostViewModel gem)
        {
            _buildsRepository.CreateGem(gem.LinkId, gem.Name, gem.Active, gem.AttributeId, gem.MaxLevel);

            return new OkResult();
        }

        public IActionResult OnPostTargetLevel([FromBody] TargetLevelPostViewModel targetLevel)
        {
            _buildsRepository.CreateTargetLevel(targetLevel.BuildId, targetLevel.ActNumber, targetLevel.Level, targetLevel.Progress);

            return new OkResult();
        }

        public IActionResult OnPostStepOrder([FromBody] List<ItemOrderPostViewModel> orders)
        {
            foreach (ItemOrderPostViewModel order in orders)
            {
                _buildsRepository.UpdateStepOrder(order.ItemId, order.Index);
            }

            return new OkResult();
        }

        public IActionResult OnPutStep([FromBody] StepPutViewModel step)
        {
            _buildsRepository.UpdateStep(step.StepId, step.Category, step.Name);

            return new OkResult();
        }

        public IActionResult OnPutPoint([FromBody] PointPutViewModel point)
        {
            _buildsRepository.UpdatePoint(point.PointId, point.Text);

            return new OkResult();
        }

        public IActionResult OnPutGem([FromBody] GemPutViewModel gem)
        {
            _buildsRepository.UpdateGem(gem.GemId, gem.Name, gem.Active, gem.AttributeId, gem.MaxLevel);

            return new OkResult();
        }

        public IActionResult OnPutTargetLevel([FromBody] TargetLevelPutViewModel targetLevel)
        {
            _buildsRepository.UpdateTargetLevel(targetLevel.TargetLevelId, targetLevel.Level, targetLevel.Progress);

            return new OkResult();
        }
    }

    public class NewBuildPostViewModel
    {
        public string Id { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
        public string Version { get; set; } = String.Empty;
    }

    public class StepPostViewModel()
    {
        public string BuildId { get; set; } = String.Empty;
        public int ActNumber { get; set; } = 0;
        public string Category { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
    }

    public class PointPostViewModel()
    {
        public int StepId { get; set; }
        public int? ParentId { get; set; }
        public string Text { get; set; } = String.Empty;
    }

    public class LinkPostViewModel()
    {
        public string BuildId { get; set; } = String.Empty;
        public int ActNumber { get; set; }
    }

    public class GemPostViewModel()
    {
        public long LinkId { get; set; }
        public string Name { get; set; } = String.Empty;
        public bool Active { get; set; } = true;
        public string AttributeId { get; set; } = String.Empty;
        public long? MaxLevel { get; set; }
    }

    public class TargetLevelPostViewModel()
    {
        public string BuildId { get; set; } = String.Empty;
        public int ActNumber { get; set; }
        public string Level { get; set; } = String.Empty;
        public string Progress { get; set; } = String.Empty;
    }

    public class ItemOrderPostViewModel
    {
        public int ItemId { get; set; } = 0;
        public int Index { get; set; } = 0;
    }

    public class StepPutViewModel()
    {
        public int StepId { get; set; } = 0;
        public string Category { get; set; } = String.Empty;
        public string Name { get; set; } = String.Empty;
    }

    public class PointPutViewModel()
    {
        public int PointId { get; set; } = 0;
        public string Text { get; set; } = String.Empty;
    }

    public class GemPutViewModel()
    {
        public long GemId { get; set; }
        public string Name { get; set; } = String.Empty;
        public bool Active { get; set; } = true;
        public string AttributeId { get; set; } = String.Empty;
        public long? MaxLevel { get; set; }
    }

    public class TargetLevelPutViewModel()
    {
        public long TargetLevelId { get; set; }
        public string Level { get; set; } = String.Empty;
        public string Progress { get; set; } = String.Empty;
    }
}
