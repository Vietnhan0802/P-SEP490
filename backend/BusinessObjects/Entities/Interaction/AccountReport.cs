using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Interaction
{
    public class AccountReport
    {
        public Guid Id { get; set; }

        public string AccountId { get; set; }

        public string ReporterId { get; set; }

        public bool? IsAccepted { get; set; }

        public string Content { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
