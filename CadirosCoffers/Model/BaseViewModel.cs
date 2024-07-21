using Microsoft.AspNetCore.Mvc.RazorPages;

namespace CadirosCoffers.Model
{
    public class BaseViewModel : PageModel
    {
        public IEnumerable<BuildSimple>? AvailableBuilds { get; set; }
    }
}
