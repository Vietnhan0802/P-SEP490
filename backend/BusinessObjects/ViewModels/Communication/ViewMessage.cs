namespace BusinessObjects.ViewModels.Communication
{
    public class ViewMessage
    {
        public Guid idMessage { get; set; }
        public Guid idConversation { get; set; }
        public string? idSender { get; set; }
        public string? senderName { get; set; }
        public string? idReceiver { get; set; }
        public string? receiverName { get; set; }
        public string? content { get; set; }
        public bool? isRevoked { get; set; }
        public bool? isDeleted { get; set; }
        public DateTime createdDate { get; set; }
    }
}
