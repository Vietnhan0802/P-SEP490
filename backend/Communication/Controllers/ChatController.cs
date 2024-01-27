using AutoMapper;
using BusinessObjects.Entities.Communication;
using BusinessObjects.ViewModels.Communication;
using BusinessObjects.ViewModels.User;
using Communication.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Communication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly ChatHub _chatHub;

        public ChatController(AppDBContext context, IMapper mapper, ChatHub chatHub)
        {
            _context = context;
            _mapper = mapper;
            _chatHub = chatHub;
        }

        /*------------------------------------------------------------Conversation------------------------------------------------------------*/

        [HttpGet("GeConversationsByUser/{idCurrentUser}")]
        public async Task<Response> GeConversationsByUser(string idCurrentUser)
        {
            var conversations = await _context.Conversations.Where(x => (x.idAccount1 == idCurrentUser && x.isDeletedBySender == false) 
                                                                     || (x.idAccount2 == idCurrentUser && x.isDeletedByReceiver == false)).ToListAsync();
            if (conversations == null)
            {
                return new Response(HttpStatusCode.NoContent, "Conversation doesn't empty!");
            }
            var result = _mapper.Map<ViewConversation>(conversations);
            return new Response(HttpStatusCode.OK, "Getall conversations is success!", result);
        }

        [HttpPost("CreateConversation/{idCurrentUser}/{idReceiver}")]
        public async Task<Response> CreateConversation(string idCurrentUser, string idReceiver)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => (x.idAccount1 == idCurrentUser && x.idAccount2 == idReceiver) || (x.idAccount1 == idReceiver && x.idAccount2 == idCurrentUser));
            if (conversation == null)
            {
                conversation = new Conversation
                {
                    idAccount1 = idCurrentUser,
                    idAccount2 = idReceiver,
                    isDeletedBySender = false,
                    isDeletedByReceiver = false,
                    createdDate = DateTime.Now,
                };
                await _context.Conversations.AddAsync(conversation);
                await _context.SaveChangesAsync();
                var result = _mapper.Map<ViewConversation>(conversation);
                await _chatHub.StartConversation(idCurrentUser, idReceiver);
                return new Response(HttpStatusCode.OK, "Create conversation is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Conversation had been existed!");
        }

        [HttpDelete("RemoveConversation")]
        public async Task<Response> RemoveConversation(Guid idConversation, string idCurrentUser)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => x.idConversation == idConversation);
            if (conversation == null)
            {
                return new Response(HttpStatusCode.NotFound, "Conversation doesn't exist!");
            }
            if (idCurrentUser == conversation.idAccount1)
            {
                conversation.isDeletedBySender = true;
                var messages = await _context.Messages.Where(x => x.idConversation == conversation.idConversation).ToListAsync();
                foreach (var message in messages)
                {
                    message.isDeletedBySender = true;
                }
            }
            else if (idCurrentUser == conversation.idAccount2)
            {
                conversation.isDeletedByReceiver = true;
                var messages = await _context.Messages.Where(x => x.idConversation == conversation.idConversation).ToListAsync();
                foreach (var message in messages)
                {
                    message.isDeletedByReceiver = true;
                }
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Delete conversation is success!");
        }

        /*------------------------------------------------------------Message------------------------------------------------------------*/

        [HttpGet("GetMessages/{currentUser}/{idSender}/{idReceiver}")]
        public async Task<Response> GetMessages(string currentUser, string idSender, string idReceiver)
        {
            var messages = await _context.Messages.Where(x => x.idSender == idSender && x.idReceiver == idReceiver).ToListAsync();
            if (currentUser == idSender)
            {
                messages = messages.Where(x => x.isDeletedBySender == false).ToList();
            }
            else if (currentUser == idReceiver) 
            {
                messages = messages.Where(x => x.isDeletedByReceiver == false).ToList();
            }
            return new Response(HttpStatusCode.NoContent, "Conversation had been existed!");
        }

        [HttpPost("CreateMessage/{idSender}/{idReceiver}")]
        public async Task<Response> CreateMessage(string idSender, string idReceiver, CreateUpdateMessage createUpdateMessage)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => (x.idAccount1 == idSender && x.idAccount2 == idReceiver) || (x.idAccount1 == idReceiver && x.idAccount2 == idSender));
            if (conversation != null)
            {
                var message = new Message
                {
                    idConversation = conversation.idConversation,
                    idSender = idSender,
                    idReceiver = idReceiver,
                    content = createUpdateMessage.content,
                    isDeletedBySender = false,
                    isDeletedByReceiver = false,
                    createdDate = DateTime.Now,
                };
                await _context.Messages.AddAsync(message);
                await _context.SaveChangesAsync();
                var result = _mapper.Map<ViewMessage>(message);
                await _chatHub.SendMessage(idSender, idReceiver, result);
                return new Response(HttpStatusCode.OK, "Send message is success!", result);
            }
            return new Response(HttpStatusCode.NotFound, "Conversation doesn't exist!");
        }

        [HttpPut("UpdateMessage/{idMessage}")]
        public async Task<Response> UpdateMessage(Guid idMessage, CreateUpdateMessage createUpdateMessage)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.idMessage == idMessage);
            if (message == null)
            {
                return new Response(HttpStatusCode.NotFound, "Message doesn't exist!");
            }
            _mapper.Map(createUpdateMessage, message);
            _context.Messages.Update(message);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewMessage>(message);
            await _chatHub.UpdateMessage(result.idSender!, result.idReceiver!, result);
            return new Response(HttpStatusCode.OK, "Update message is success!", result);
        }

        [HttpDelete("DeleteMessage/{idMessage}")]
        public async Task<Response> RecallMessage(Guid idMessage, string deletedBy)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.idMessage == idMessage);
            if (message == null)
            {
                return new Response(HttpStatusCode.NotFound, "Message doesn't exist!");
            }
            if (message.idSender == deletedBy)
            {
                message.isDeletedBySender = true;
            }
            else if (message.idReceiver == deletedBy)
            {
                message.isDeletedByReceiver = true;
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Delete message is success!");
        }
    }
}
