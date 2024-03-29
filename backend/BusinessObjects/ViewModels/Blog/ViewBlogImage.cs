﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Blog
{
    public class ViewBlogImage
    {
        public Guid idBlogImage { get; set; }
        public Guid idBlog { get; set; }
        public string image { get; set; }
        public DateTime createdDate { get; set; }

        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
