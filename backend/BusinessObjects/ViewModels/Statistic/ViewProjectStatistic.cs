namespace BusinessObjects.ViewModels.Statistic
{
    public class ViewProjectStatistic
    {
        public Guid idProject { get; set; }
        public string avatarProject { get; set; }
        public string nameProject { get; set; }
        public string idAccount { get; set; }
        public string avatar { get; set; }
        public string fullname { get; set; }
        public double ratingAvg { get; set; }
        public int commentSum { get; set; }
    }
}
