namespace BusinessObjects.ViewModels.User
{
    public class Account
    {
        public Guid Id { get; set; }
        public string email { get; set; }
        public string fullName { get; set; }
        public DateTime birthday { get; set; }
        public bool isMale { get; set; }
        public string phoneNumber { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
        public string avatar { get; set; }
    }
}
