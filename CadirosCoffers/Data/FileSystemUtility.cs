using System.IO.Abstractions;

namespace CadirosCoffers.Data
{
    public class FileSystemUtility(IFileSystem fileSystem)
    {
        public string GetImageFileAsBase64(string path)
        {
            Byte[] bytes = fileSystem.File.ReadAllBytes(path);
            string base64 = Convert.ToBase64String(bytes);

            return base64;
        }
    }
}
