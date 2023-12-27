using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Interaction
{
    public class Verification
    {
        [Key]

        public Guid Id { get; set; }
        public Guid IdAccount { get; set; }
        public bool? IsAccept { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
