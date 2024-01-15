using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Entities.Notification
{
    public class Notifications
    {
        [Key]
        public Guid IdNotification { get; set; }
        public Guid IdReceiver { get; set; }
        public Guid IdSender { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public string Url { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
