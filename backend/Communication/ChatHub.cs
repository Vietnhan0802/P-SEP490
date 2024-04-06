using BusinessObjects.Entities.Communication;
using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string idCurrentUser, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.All.SendAsync("ReceiveMessage", idCurrentUser, idReceiver, viewMessage);
       
        }

        public async Task StartConversation(string idCurrentUser, string idReceiver)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversation.idConversation.ToString());
            await Clients.Groups(conversation.idConversation.ToString()).SendAsync("ReceiveMessage", $"{conversation.idAccount1} and {conversation.idAccount2} has joined {conversation.idConversation}");
        }

        /*public async Task SendMessage(string idCurrentUser, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.User(idCurrentUser).SendAsync("ReceiverMessage", viewMessage);
            await Clients.User(idReceiver).SendAsync("ReceiverMessage", viewMessage);
        }*/

        public async Task ReceiveMessage(ViewMessage message)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", message);
        }
    }
}
