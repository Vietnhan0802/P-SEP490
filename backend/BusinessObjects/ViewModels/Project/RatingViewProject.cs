namespace BusinessObjects.ViewModels.Project
{
    public class RatingViewProject
    {
        public Guid idRating { get; set; }
        public string idRater { get; set; }
        public string? email { get; set; }
        public string? fullName { get; set; }
        public string? avatar { get; set; }
        public bool isVerified { get; set; }
        public Guid? idProject { get; set; }
        public int rating { get; set; }
        public string? comment { get; set; }
        public DateTime createdDate { get; set; }
        public double ratingAvg { get; set; }
        public double ratingNum { get; set; }
        public double rating5 { get; set; }
        public double rating4 { get; set; }
        public double rating3 { get; set; }
        public double rating2 { get; set; }
        public double rating1 { get; set; }
    }
}
