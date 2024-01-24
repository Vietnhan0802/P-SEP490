using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ViewModels.Post
{
    public class CreatePostViewModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Image { get; set; }
        public string Major { get; set; }
        public string Exp { get; set; }
        //public int View { get; set; }
    }
}
