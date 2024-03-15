﻿using BusinessObjects.Enums.Project;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectInfoCreate
    {
        public string? name { get; set; }
        public string? description { get; set; }
        public string? avatar { get; set; }
        public Visibility visibility { get; set; }
        public ICollection<string>? namePosition { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
