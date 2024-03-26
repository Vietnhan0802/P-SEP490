using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task StartConversation(string idCurrentUser, string idReceiver)
        {
            await Clients.User(idReceiver).SendAsync("StartConversation", idCurrentUser);
        }

        public async Task GetMessages(List<ViewMessage> viewMessage)
        {
            await Clients.Caller.SendAsync("GetMessage", viewMessage);
        }

        public async Task SendMessage(string idCurrentUser, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.User(idCurrentUser).SendAsync("ReceiverMessage", viewMessage);
            await Clients.User(idReceiver).SendAsync("ReceiverMessage", viewMessage);
        }

        public async Task RecallMessage (string idReceiver, Guid idMessage)
        {
            await Clients.User(idReceiver).SendAsync("RecallMessage", idMessage);
        }
    }
}
