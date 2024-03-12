namespace BusinessObjects.ViewModels.Notification
{
    public class ViewNotification
    {
        public Guid idNotification { get; set; }
        public string? idSender { get; set; }
        public string? nameSender { get; set; }
        public string? avatar { get; set; }
        public string? content { get; set; }
        public bool? isRead { get; set; }
        public string? url { get; set; }
        public DateTime createdDate { get; set; }
    }
}
