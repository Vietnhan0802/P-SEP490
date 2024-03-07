using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Credential
{
    public class Degree
    {
        [Key]
        public Guid idDegree { get; set; }
        public string? idAccount { get; set; }
        public string? name { get; set; }
        public string? institution { get; set; }
        public string? url { get; set; }
        public string? file { get; set; }
        public bool? isDeleted { get; set; }
        public DateTime createdDate { get; set; }
    }
}
