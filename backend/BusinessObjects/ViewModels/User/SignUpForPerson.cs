namespace BusinessObjects.ViewModels.User
{
    public class SignUpForPerson
    {
        public string email { get; set; }
        public string password { get; set; }
        public string fullName { get; set; }
        public DateTime birthday { get; set; }
        public bool isMale { get; set; }
        public string phone { get; set; }
        public string address { get; set; }
    }
}
