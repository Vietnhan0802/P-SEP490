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

        [HttpGet("GetAllConversations/{idSender}")]
        public async Task<Response> GetAllConversations(string idSender)
        {
            var conversations = await _context.Conversations.Where(x => x.idAccount1 == idSender || x.idAccount2 == idSender).ToListAsync();
            if (conversations == null)
            {
                return new Response(HttpStatusCode.NoContent, "Conversation doesn't empty!");
            }
            var result = _mapper.Map<ViewConversation>(conversations);
            await _chatHub.GetAllConversation(result);
            return new Response(HttpStatusCode.OK, "Getall conversations is success!", result);
        }

        [HttpPost("CreateConversation/{idSender}/{idReceiver}")]
        public async Task<Response> CreateConversation(string idSender, string idReceiver)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => (x.idAccount1 == idSender && x.idAccount2 == idReceiver) || (x.idAccount1 == idReceiver && x.idAccount2 == idSender));
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
                var result = _mapper.Map<ViewConversation>(conversation);
                await _chatHub.StartConversation(idSender, result);
                return new Response(HttpStatusCode.OK, "Create conversation is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Conversation had been existed!");
        }

        /*------------------------------------------------------------Message------------------------------------------------------------*/

        [HttpGet("GetMessageByConversation/{idConversation}")]
        /*public Task<Response> GetMessageByConversation(Guid idConversation)
        {

        }*/

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
                    isDeleted = false,
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
            _context.SaveChanges();
            var result = _mapper.Map<ViewMessage>(message);
            await _chatHub.UpdateMessage(result.idSender!, result.idReceiver!, result);
            return new Response(HttpStatusCode.OK, "Update message is success!", result);
        }
    }
}
