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
        public string? projectName { get; set; }
        public int rating { get; set; }
        public string? comment { get; set; }
        public DateTime createdDate { get; set; }
    }
}
