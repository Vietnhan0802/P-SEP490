﻿using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Post
{
    public class ViewPostImage
    {
        public Guid idPostImage { get; set; }
        public Guid idPost { get; set; }
        public string? image { get; set; }
        public DateTime createdDate { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
    }
}
