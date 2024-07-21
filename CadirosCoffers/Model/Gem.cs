namespace CadirosCoffers.Model
{
    public class Gem(long gemId, string name, string attribute, long active, long? maxLevel)
    {
        public long GemId { get; set; } = gemId;
        public string Name { get; set; } = name;
        public string Attribute { get; set; } = attribute;
        public bool Active { get; set; } = active > 0;
        public long? MaxLevel { get; set;} = maxLevel;
    }
}
