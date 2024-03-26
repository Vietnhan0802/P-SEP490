using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Communication
{
    public class Message
    {
        [Key]
        public Guid idMessage { get; set; }
        public Guid idConversation { get; set; }
        public string idSender { get; set; }
        public bool isDeletedBySender { get; set; }
        public string idReceiver { get; set; }
        public bool isDeletedByReceiver { get; set; }
        public string? content { get; set; }
        public bool isRecall { get; set; }
        public DateTime createdDate { get; set; }
        public Conversation? Conversation { get; set; }
    }
}
