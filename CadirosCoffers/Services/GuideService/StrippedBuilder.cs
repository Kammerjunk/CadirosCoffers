using CadirosCoffers.Data;
using CadirosCoffers.Model;
using CadirosCoffers.Options;

namespace CadirosCoffers.Services.GuideService
{
    public class StrippedBuilder(DatabaseOptions databaseOptions)
    {
        public BuildsRepository Repository => new(databaseOptions);

        public Act BuildAct(string buildId, int actNumber)
        {
            Act act = new(actNumber);

            act.AddSteps(Repository.GetActStepsForBuild(buildId, actNumber));

            return act;
        }

        public Step BuildStep(int stepId)
        {
            Step step = new(stepId);

            step.AddPoints(Repository.GetPointsForStep(stepId));

            return step;
        }

        public StepPoint BuildPoint(int pointId)
        {
            StepPoint point = new(pointId);

            point.AddSubpoints(Repository.GetSubpointsForPoint(pointId));

            return point;
        }
    }
}
