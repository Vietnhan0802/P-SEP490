using BusinessObjects.Entities.Communication;
using Communication.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Communication
{
    public class ChatHub : Hub
    {
        private readonly AppDBContext _context;

        public ChatHub(AppDBContext context)
        {
            _context = context;
        }

        public async Task StartConversation(string idSender, string idReceiver)
        {
            var conversation = await _context.Conversations
                .Include(x => x.Messages)
                .FirstOrDefaultAsync(x => (x.idAccount1 == idSender && x.idAccount2 == idReceiver) || (x.idAccount1 == idReceiver && x.idAccount2 == idSender));
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    idAccount1 = idSender,
                    idAccount2 = idReceiver,
                    createdDate = DateTime.Now,
                };

                await _context.Conversations.AddAsync(conversation);
                await _context.SaveChangesAsync();
            }

            await Clients.User(idSender).SendAsync("ReceiverChat", conversation);
        }

        public async Task GetAllConversation(string idSender)
        {
            var conversations = await _context.Conversations
                .Include(x => x.Messages)
                .Where(x => x.idAccount1 == idSender || x.idAccount2 == idSender)
                .ToListAsync();

            await Clients.Caller.SendAsync("ReceiverAllConversation", conversations);
        }

        public async Task SendMessage(string idSender, string idReceiver, string content)
        {
            var conversation = await _context.Conversations
                .Include(x => x.Messages)
                .FirstOrDefaultAsync(x => (x.idAccount1 == idSender && x.idAccount2 == idReceiver) || (x.idAccount1 == idReceiver && x.idAccount2 == idSender));
            if (conversation != null)
            {
                var message = new Message
                {
                    idConversation = conversation.idConversation,
                    idSender = idSender,
                    idReceiver = idReceiver,
                    content = content,
                    isDeleted = false,
                    createdDate = DateTime.Now,
                };

                await _context.Messages.AddAsync(message);
                await _context.SaveChangesAsync();

                await Clients.User(idSender).SendAsync("ReceiverMessage", conversation, message);
                await Clients.User(idReceiver).SendAsync("ReceiverMessage", conversation, message);
            }
        }
    }
}
