using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Projects
{
    public class Position
    {
        [Key]
        public Guid idPosition { get; set; }
        public Guid idProject { get; set; }
        public string? namePosition { get; set; }
        public ProjectInfo? ProjectInfo { get; set; }
    }
}
