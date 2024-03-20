using BusinessObjects.Entities.Communication;

namespace BusinessObjects.ViewModels.Communication
{
    public class ViewConversation
    {
        public Guid idConversation { get; set; }
        public string? idAccount1 { get; set; }
        public string? idAccount2 { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public DateTime createdDate { get; set; }
    }
}
