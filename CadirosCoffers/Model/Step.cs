namespace CadirosCoffers.Model
{
    public class Step
    {
        public Step(long stepId, long stepIndex, string category, string name)
        {
            StepId = stepId;
            StepIndex = stepIndex;
            Category = category;
            Name = name;

            Points = [];
        }

        public Step(long stepId)
        {
            StepId = stepId;

            Points = [];
        }

        public long StepId { get; set; }
        public long? StepIndex { get; set; }
        public string? Category { get; set; }
        public string? Name { get; set; }

        public List<StepPoint> Points { get; }

        public void AddPoint(StepPoint point)
        {
            Points.Add(point);
        }

        public void AddPoints(IEnumerable<StepPoint> points)
        {
            Points.AddRange(points);
        }
    }
}
