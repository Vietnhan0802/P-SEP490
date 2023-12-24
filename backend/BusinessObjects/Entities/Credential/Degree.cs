namespace BusinessObjects.Entities.Credential
{
    public class Degree
    {
        public Guid idDegree { get; set; }
        public Guid idAccount { get; set; }
        public DateTime date { get; set; }
        public string institution { get; set; }
        public string country { get; set; }
        public string type { get; set; }
        public string major { get; set; }
        public string image { get; set; }
        public DateTime createdDate { get; set; } = DateTime.Now;
    }
}
