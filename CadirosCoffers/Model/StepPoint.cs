namespace CadirosCoffers.Model
{
    public class StepPoint(long stepPointId, long? parentPointId, long stepPointIndex, string text)
    {
        public long StepPointId { get; set; } = stepPointId;
        public long? ParentPointId { get; set; } = parentPointId;
        public long StepPointIndex { get; set; } = stepPointIndex;
        public string Text { get; set; } = text;

        public List<StepPoint> Subpoints { get; } = [];

        public void AddSubpoint(StepPoint point)
        {
            Subpoints.Add(point);
        }

        public void AddSubpoints(IEnumerable<StepPoint> points)
        {
            Subpoints.AddRange(points);
        }
    }
}
