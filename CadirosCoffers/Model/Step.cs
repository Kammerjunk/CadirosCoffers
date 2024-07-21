namespace CadirosCoffers.Model
{
    public class Step(long stepId, long stepIndex, string category, string name)
    {
        public long StepId { get; set; } = stepId;
        public long StepIndex { get; set; } = stepIndex;
        public string Category { get; set; } = category;
        public string Name { get; set; } = name;

        public List<StepPoint> Points { get; } = [];

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
