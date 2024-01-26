using BusinessObjects.Entities.Communication;
using BusinessObjects.ViewModels.Communication;
using Communication.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task StartConversation(string idSender, ViewConversation viewConversation)
        {
            await Clients.User(idSender).SendAsync("ReceiverConversation", viewConversation);
        }

        public async Task GetAllConversation(ViewConversation viewConversation)
        {
            await Clients.Caller.SendAsync("ReceiverAllConversation", viewConversation);
        }

        public async Task SendMessage(string idSender, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.User(idSender).SendAsync("ReceiverMessage", viewMessage);
            await Clients.User(idReceiver).SendAsync("ReceiverMessage", viewMessage);
        }

        public async Task UpdateMessage(string idSender, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.User(idSender).SendAsync("ReceiverMessage", viewMessage);
            await Clients.User(idReceiver).SendAsync("ReceiverMessage", viewMessage);
        }
    }
}
