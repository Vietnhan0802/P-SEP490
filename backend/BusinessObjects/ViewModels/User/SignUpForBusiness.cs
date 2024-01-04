﻿namespace BusinessObjects.ViewModels.User
{
    public class SignUpForBusiness
    {
        public string email { get; set; }
        public string password { get; set; }
        public string fullName { get; set; }
        public DateTime establishment { get; set; }
        public string phone { get; set; }
        public int tax { get; set; }
        public string address { get; set; }
    }
}
