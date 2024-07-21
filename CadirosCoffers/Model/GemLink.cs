namespace CadirosCoffers.Model
{
    public class GemLink(long gemLinkId)
    {
        public long GemLinkId { get; set; } = gemLinkId;

        public List<Gem> Gems { get; } = [];

        public void AddGem(Gem gem)
        {
            Gems.Add(gem);
        }

        public void AddGems(IEnumerable<Gem> gems)
        {
            Gems.AddRange(gems);
        }
    }
}
