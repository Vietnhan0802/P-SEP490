namespace BusinessObjects.ViewModels.Credential
{
    public class ViewDegree
    {
        public Guid idDegree { get; set; }
        public string idAccount { get; set; }
        public DateTime date { get; set; }
        public string institution { get; set; }
        public string country { get; set; }
        public string type { get; set; }
        public string major { get; set; }
        public string image { get; set; }
        public bool isDeleted { get; set; }
        public DateTime createdDate { get; set; }
    }
}
