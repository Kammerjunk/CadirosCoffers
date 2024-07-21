namespace CadirosCoffers.Model
{
    public class TargetLevel(long targetLevelId, string level, string progress)
    {
        public long TargetLevelId { get; set; } = targetLevelId;
        public string Level { get; set; } = level;
        public string Progress { get; set; } = progress;
    }
}
