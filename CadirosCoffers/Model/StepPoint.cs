namespace CadirosCoffers.Model
{
    public class StepPoint
    {
        public StepPoint(long stepPointId, long? parentPointId, long stepPointIndex, string text)
        {
            StepPointId = stepPointId;
            ParentPointId = parentPointId;
            StepPointIndex = stepPointIndex;
            Text = text;

            Subpoints = [];
        }

        public StepPoint(long stepPointId)
        {
            StepPointId = stepPointId;
        }

        public long StepPointId { get; set; }
        public long? ParentPointId { get; set; }
        public long? StepPointIndex { get; set; }
        public string? Text { get; set; }

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
