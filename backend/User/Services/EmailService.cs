using Commons.Helpers;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace User.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfiguration _emailConfiguration;

        public EmailService(IOptions<EmailConfiguration> options)
        {
            _emailConfiguration = options.Value;
        }
        public async Task SendEmailAsync(EmailRequest emailRequest)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("Enterprise Information Technology Connectivity System", _emailConfiguration.Email));
            email.To.Add(MailboxAddress.Parse(emailRequest.ToEmail));
            email.Subject = emailRequest.Subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = emailRequest.Body;
            email.Body = builder.ToMessageBody();

            using var stmp = new SmtpClient();
            stmp.Connect(_emailConfiguration.Host, _emailConfiguration.Port, SecureSocketOptions.StartTls);
            stmp.Authenticate(_emailConfiguration.Email, _emailConfiguration.Password);
            await stmp.SendAsync(email);
            stmp.Disconnect(true);
        }
    }
}
