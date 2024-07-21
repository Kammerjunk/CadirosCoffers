namespace CadirosCoffers.Model
{
    public class ActMap(int number)
    {
        public int Number { get; set; } = number;

        public List<ZoneMap> Zones { get; set; } = [];

        public void AddZone(ZoneMap zone)
        { 
            Zones.Add(zone);
        }

        public void AddZones(IEnumerable<ZoneMap> zones)
        {
            Zones.AddRange(zones);
        }
    }
}
