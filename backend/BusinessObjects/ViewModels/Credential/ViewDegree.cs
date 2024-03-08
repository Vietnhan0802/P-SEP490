using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Credential
{
    public class ViewDegree
    {
        public Guid idDegree { get; set; }
        public string? idAccount { get; set; }
        public string? name { get; set; }
        public string? institution { get; set; }
        public string? url { get; set; }
        public string? file { get; set; }
        [NotMapped]
        public string? FileSrc { get; set; }
    }
}
