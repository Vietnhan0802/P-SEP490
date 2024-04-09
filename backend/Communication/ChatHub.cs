using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        public ChatHub()
        {
        }

        public async Task AddToGroup(string connectionId, Guid idConversation)
        {
            await Groups.AddToGroupAsync(connectionId, idConversation.ToString());
        }

        public async Task SendMessageToGroup(Guid idConversation, ViewMessage viewMessage)
        {
            await Clients.Group(idConversation.ToString()).SendAsync("ReceiveMessage", viewMessage);
        }

        public async Task StartConversation(string idCurrentUser, string idReceiver)
        {
            await Clients.User(idReceiver).SendAsync("StartConversation", idCurrentUser);
        }

        public async Task GetMessages(List<ViewMessage> viewMessage)
        {
            await Clients.Caller.SendAsync("GetMessage", viewMessage);
        }

        public async Task RecallMessage (string idReceiver, Guid idMessage)
        {
            await Clients.User(idReceiver).SendAsync("RecallMessage", idMessage);
        }
    }
}
