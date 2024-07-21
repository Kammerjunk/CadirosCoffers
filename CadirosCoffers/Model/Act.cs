namespace CadirosCoffers.Model
{
    public class Act(int number)
    {
        public int Number { get; set; } = number;

        public List<Step> Steps { get; } = [];
        public List<GemLink> GemLinks { get; } = [];
        public List<TargetLevel> TargetLevels { get; } = [];

        public void AddStep(Step step)
        {
            Steps.Add(step);
        }
        public void AddSteps(IEnumerable<Step> steps)
        {
            Steps.AddRange(steps);
        }

        public void AddGemLink(GemLink gemLink)
        {
            GemLinks.Add(gemLink);
        }
        public void AddGemLinks(IEnumerable<GemLink> gemLinks)
        {
            GemLinks.AddRange(gemLinks);
        }

        public void AddTargetLevel(TargetLevel targetLevel)
        {
            TargetLevels.Add(targetLevel);
        }

        public void AddTargetLevels(IEnumerable<TargetLevel> targetLevels)
        {
            TargetLevels.AddRange(targetLevels);
        }
    }
}
