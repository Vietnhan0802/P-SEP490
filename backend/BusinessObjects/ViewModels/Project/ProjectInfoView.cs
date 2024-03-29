﻿using BusinessObjects.Enums.Project;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Project
{
    public class ProjectInfoView
    {
        public Guid idProject { get; set; }
        public string? idAccount { get; set; }
        public string? fullName { get; set; }
        public string? avatarUser { get; set; }
        public string? name { get; set; }
        public string? description { get; set; }
        public string? avatar { get; set; }
        public Process process { get; set; }
        public Visibility visibility { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<PositionView>? PositionViews { get; set; }

        [NotMapped]
        public string avatarSrc { get; set; }
    }
}
