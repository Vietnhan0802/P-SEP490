using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace Commons.Helpers
{
    public class SaveImageService
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public SaveImageService(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);

            var imagePath = Path.Combine(_hostingEnvironment.ContentRootPath, "Images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName;
        }

        public void DeleteImage(string imageName)
        {
            var imagePath = Path.Combine(_hostingEnvironment.ContentRootPath, "Images", imageName);

            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }
    }
}
