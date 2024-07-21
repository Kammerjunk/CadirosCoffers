namespace CadirosCoffers.Model
{
    public class CampaignMap()
    {
        public List<ActMap> Acts { get; set; } = [];

        public void AddAct(ActMap act)
        {
            Acts.Add(act);
        }

        public void AddActs(IEnumerable<ActMap> acts)
        {
            Acts.AddRange(acts);
        }
    }
}
