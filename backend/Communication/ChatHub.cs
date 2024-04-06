using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        public async Task JoinRoom(ViewConversation conversation)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conversation.idConversation.ToString());
            await Clients.Groups(conversation.idConversation.ToString()).SendAsync("ReceiveMessage", $"{conversation.idAccount1} and {conversation.idAccount2} has joined {conversation.idConversation}");
        }

        public async Task SendMessage(string sender, string receiver, ViewMessage message)
        {
            await Clients.User(receiver).SendAsync("ReceiveMessage", sender, receiver, message);
        }

        public async Task ReceiveMessage(ViewMessage message)
        {
            await Clients.Caller.SendAsync("ReceiveMessage", message);
        }
    }
}
