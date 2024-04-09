using BusinessObjects.ViewModels.Communication;
using Microsoft.AspNetCore.SignalR;

namespace Communication
{
    public class ChatHub : Hub
    {
        private readonly string _chatBot;
        private readonly IDictionary<string, JoinConversation> _connections;

        public ChatHub(IDictionary<string, JoinConversation> connections)
        {
            _chatBot = "Chat Box";
            _connections = connections;
        }

        public async Task SendMessage(ViewMessage message)
        {
            if (_connections.TryGetValue(Context.ConnectionId, out JoinConversation joinConversation))
            {
                await Clients.Group(joinConversation.idConversation.ToString()).SendAsync("ReceiveMessage", message);
            }
        }

        public async Task JoinConversation(JoinConversation joinConversation)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, joinConversation.idConversation.ToString());
            _connections[Context.ConnectionId] = joinConversation;
            //await Clients.Group(joinConversation.idConversation.ToString()).SendAsync("ReceiveMessage", _chatBot, $"{joinConversation.idCurrentUser} has joined {joinConversation.idConversation}");
        }

        /*public async Task SendMessage(string idCurrentUser, string idReceiver, ViewMessage viewMessage)
        {
            string grName = GetGroupName(idCurrentUser, idReceiver);
            await Clients.Group(grName).SendAsync("ReceiveMessage", viewMessage);

            *//*Console.WriteLine($"Sending message from {idCurrentUser} to {idReceiver}: {viewMessage}");

            string receiver = connectionIds.FirstOrDefault(x => x.Value == idReceiver).Key;

            Console.WriteLine($"Receiver connection ID: {receiver}");

            if (!string.IsNullOrEmpty(receiver))
            {
                // Gửi tin nhắn đến người nhận
                await Clients.Client(receiver).SendAsync("ReceiveMessage", idReceiver, viewMessage);
            }
            else
            {
                // Nếu không tìm thấy kết nối của người nhận, in ra thông báo
                Console.WriteLine($"Unable to find connection for user: {idReceiver}");
            }*//*
        }*/

        public async Task StartConversation(string idCurrentUser, string idReceiver)
        {
            await Clients.User(idReceiver).SendAsync("StartConversation", idCurrentUser);
        }

        public async Task GetMessages(List<ViewMessage> viewMessage)
        {
            await Clients.Caller.SendAsync("GetMessage", viewMessage);
        }

        /*public async Task SendMessage(string idCurrentUser, string idReceiver, ViewMessage viewMessage)
        {
            await Clients.User(idCurrentUser).SendAsync("ReceiverMessage", viewMessage);
            await Clients.User(idReceiver).SendAsync("ReceiverMessage", viewMessage);
        }*/

        public async Task RecallMessage (string idReceiver, Guid idMessage)
        {
            await Clients.User(idReceiver).SendAsync("RecallMessage", idMessage);
        }
    }
}
