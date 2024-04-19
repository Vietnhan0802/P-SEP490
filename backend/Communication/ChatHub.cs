using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        private static Dictionary<string, string> _connections = new Dictionary<string, string>();

        private string GetUserIdFromRequest()
        {
            // Lấy userId từ QueryString
            string userId = Context.GetHttpContext()!.Request.Query["userId"]!;

            // Hoặc lấy userId từ header HTTP
            // string userId = Context.GetHttpContext().Request.Headers["userId"];

            return userId;
        }

        public override Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            string userId = GetUserIdFromRequest(); // Lấy userId từ Request

            lock (_connections)
            {
                _connections[userId] = connectionId;
            }

            return base.OnConnectedAsync();
        }

        public async Task SendMessageToClient(string receiveId, ViewMessage viewMessage)
        {
            if (_connections.TryGetValue(receiveId, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", connectionId, viewMessage);
            }
        }

        public async Task AddToGroup(string connectionId, Guid idConversation)
        {
            await Groups.AddToGroupAsync(connectionId, idConversation.ToString());
        }

        public async Task SendMessageToGroup(Guid idConversation, string idSender, ViewMessage viewMessage)
        {
            await Clients.Group(idConversation.ToString()).SendAsync("ReceiveMessage", idSender, viewMessage);
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
