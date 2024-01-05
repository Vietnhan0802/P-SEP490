using Commons.Helpers;

namespace User.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(EmailRequest email);
    }
}
