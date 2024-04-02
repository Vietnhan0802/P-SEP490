using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class Rating
    {
        [Key]
        public Guid idRating { get; set; }
        public string idRater { get; set; }
        public string? idRated { get; set; }
        public Guid idProjectMember { get; set; }
        public Guid? idProject { get; set; }
        public int rating { get; set; }
        public string? comment { get; set; }
        public DateTime createdDate { get; set; }
        public ProjectMember? ProjectMember { get; set; }
        public Project? Project { get; set; }
    }
}
