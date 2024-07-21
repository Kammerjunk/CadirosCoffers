namespace CadirosCoffers.Model
{
    public class ZoneMap(string name, string fileName, long zoneIndex)
    {
        public string Name { get; set; } = name;
        public string FileName { get; set; } = fileName;
        public long ZoneIndex { get; set; } = zoneIndex;
    }
}
