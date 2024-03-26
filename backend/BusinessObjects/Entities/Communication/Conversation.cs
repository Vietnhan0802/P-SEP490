using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.Entities.Communication
{
    public class Conversation
    {
        [Key]
        public Guid idConversation { get; set; }
        public string idAccount1 { get; set; }
        public string idAccount2 { get; set; }
        public bool isDeletedBySender { get; set; }
        public bool isDeletedByReceiver { get; set; }
        public DateTime createdDate { get; set; }
        public ICollection<Message>? Messages { get; set; }
    }
}
