using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.ViewModels.Communication
{
    public class ViewMessage
    {
        public Guid idMessage { get; set; }
        public Guid idConversation { get; set; }
        public string idSender { get; set; }
        public string nameSender { get; set; }
        public string avatarSender { get; set; }
        public bool isDeletedBySender { get; set; }
        public string idReceiver { get; set; }
        public string nameReceiver { get; set; }
        public string avatarReceiver { get; set; }
        public bool isVerifiedReceiver { get; set; }
        public bool isDeletedByReceiver { get; set; }
        public bool isYourself { get; set; }
        public string? content { get; set; }
        public string? image { get; set; }
        public string? file { get; set; }
        public bool? isRecall { get; set; }
        public DateTime createdDate { get; set; }
        [NotMapped]
        public string ImageSrc { get; set; }
        [NotMapped]
        public string FileSrc { get; set; }
    }
}
