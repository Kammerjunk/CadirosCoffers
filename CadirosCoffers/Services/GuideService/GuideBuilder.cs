using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;
using System.Drawing;
using System.Linq;

namespace CadirosCoffers.Services.GuideService
{
    public class GuideBuilder(DatabaseOptions databaseOptions, string buildId)
    {
        public BuildsRepository Repository => new(databaseOptions);
        public BuildSimple BuildInfo => Repository.GetBuild(buildId);

        public Guide BuildGuide()
        {
            Guide guide = new(BuildInfo.Id, BuildInfo.Name);

            for (int i = 1; i <= 10; i++)
            {
                Act? act = BuildAct(i);
                if (act != null)
                {
                    guide.AddAct(act);
                }
            }

            return guide;
        }

        private Act? BuildAct(int actNumber)
        {
            Act act = new(actNumber);

            IEnumerable<Step> actSteps = Repository.GetActStepsForBuild(BuildInfo.Id, actNumber);
            IEnumerable<GemLink> gemLinks = Repository.GetActGemLinksForBuild(BuildInfo.Id, actNumber);
            IEnumerable<TargetLevel> targetLevels = Repository.GetActTargetLevelsForBuild(BuildInfo.Id, actNumber);

            if (!actSteps.Any() && !gemLinks.Any() && !targetLevels.Any())
            {
                return null;
            }

            act.AddSteps(actSteps.OrderBy(s => s.StepIndex));
            foreach (Step step in actSteps)
            {
                BuildStep(step);
            }

            act.AddGemLinks(gemLinks.OrderBy(g => g.GemLinkId));
            foreach (GemLink gemLink in gemLinks)
            {
                BuildLink(gemLink);
            }

            act.AddTargetLevels(targetLevels.OrderBy(t => t.Progress));

            return act;
        }

        private void BuildStep(Step step)
        {
            IEnumerable<StepPoint> stepPoints = Repository.GetPointsForStep(step.StepId);

            step.AddPoints(stepPoints.Where(p => p.ParentPointId == null).OrderBy(p => p.StepPointIndex));

            foreach (IGrouping<long?, StepPoint> subpointGroup in stepPoints.Where(p => p.ParentPointId != null).GroupBy(p => p.ParentPointId))
            {
                StepPoint parentStep = stepPoints.First(p => p.StepPointId == subpointGroup.Key);
                IEnumerable<StepPoint> subpoints = subpointGroup.ToList();

                parentStep.AddSubpoints(subpoints.OrderBy(p => p.StepPointIndex));
            }
        }

        private void BuildLink(GemLink gemLink)
        {
            IEnumerable<Gem> gems = Repository.GetGemsForLink(gemLink.GemLinkId);

            gemLink.AddGems(gems.OrderBy(g => g.GemId));
        }
    }
}
