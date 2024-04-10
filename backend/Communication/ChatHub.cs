using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task AddToGroup(string connectionId, Guid idConversation)
        {
            await Groups.AddToGroupAsync(connectionId, idConversation.ToString());
        }

        public async Task SendMessageToGroup(Guid idConversation, ViewMessage viewMessage)
        {
            await Clients.Group(idConversation.ToString()).SendAsync("ReceiveMessage", viewMessage);
        }

        public async Task GetConversation(Guid idConversation, ViewMessage viewMessage)
        {
            await Clients.All.SendAsync("ReceiveConversation", idConversation, viewMessage);
        }

        public async Task RecallMessage(Guid idConversation, ViewMessage viewMessage)
        {
            await Clients.Group(idConversation.ToString()).SendAsync("RecallMessage", viewMessage);
        }
    }
}
