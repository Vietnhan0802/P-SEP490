using BusinessObjects.ViewModels.User;
using Facebook;

namespace Commons.Helpers
{
    public class Facebook
    {
        private readonly FacebookClient _client;

        public Facebook()
        {
            _client = new FacebookClient();
        }

        public async Task<FacebookUser> GetObject(string accessToken)
        {
            return await _client.GetTaskAsync<FacebookUser>(accessToken);
        }
    }
}
