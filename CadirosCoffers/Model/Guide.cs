namespace CadirosCoffers.Model
{    
    public class Guide(string id, string name)
    {
        public string Id { get; set; } = id;
        public string Name { get; set; } = name;

        public List<Act> Acts { get; set; } = [];

        public void AddAct(Act act)
        {
            Acts.Add(act);
        }
    }

    public record struct BuildSimple(string Id, string Name);
}
