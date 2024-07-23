namespace CadirosCoffers.Model
{
    public class StepCategory(string categoryId, string text)
    {
        public string CategoryId { get; set; } = categoryId;
        public string Text { get; set; } = text;
    }
}
