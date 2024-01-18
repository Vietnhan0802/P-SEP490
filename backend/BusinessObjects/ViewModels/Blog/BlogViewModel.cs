﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ViewModels.Blog
{
    public class BlogViewModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Image { get; set; }
        public int View { get; set; }
        public int LikeCount { get; set; }
    }
}
