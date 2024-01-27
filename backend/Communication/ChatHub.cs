using BusinessObjects.Entities.Communication;
using BusinessObjects.ViewModels.Communication;
using Communication.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task GetConversationByUser(ViewConversation viewConversation)
        {
            await Clients.Caller.SendAsync("ReceiverAllConversation", viewConversation);
        }

        public async Task StartConversation(string idCurrentUser, string idReceiver)
        {
            await Clients.User(idReceiver).SendAsync("StartConversation", idCurrentUser);
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

/*        public async Task RecallMessage(string idSender, string idREceiver)
        {
            await
        }*/
    }
}
