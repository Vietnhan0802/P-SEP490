﻿using BusinessObjects.Entities.Post;

namespace BusinessObjects.ViewModels.Post
{
    public class ViewPost
    {
        public Guid idPost { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public Guid idProject { get; set; }
        public string? title { get; set; }
        public string? content { get; set; }
        public string? major { get; set; }
        public string? exp { get; set; }
        public int view { get; set; }
        public bool isBlock { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<ViewPostImage>? ViewPostImages { get; set; }
    }
}
