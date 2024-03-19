using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Notification
{
    public class Notificationn
    {
        [Key]
        public Guid idNotification { get; set; }
        public string? idSender { get; set; }
        public string? idReceiver { get; set; }
        public string? content { get; set; }
        public bool? isRead { get; set; }
        public Guid? idUrl { get; set; }
        public string? url { get; set; }
        public int? count { get; set; }
        public DateTime createdDate { get; set; }
    }
}
