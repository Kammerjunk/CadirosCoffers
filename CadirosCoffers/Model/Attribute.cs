namespace CadirosCoffers.Model
{
    public class Attribute(string attributeId, string name)
    {
        public string AttributeId { get; set; } = attributeId;
        public string Name { get; set; } = name;
    }
}
