﻿using AutoMapper;
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

        [HttpDelete("RemoveConversation/{idCurrentUser}/{idConversation}")]
        public async Task<Response> RemoveConversation(string idCurrentUser, Guid idConversation)
        {
            var conversation = await _context.Conversations.FirstOrDefaultAsync(x => x.idConversation == idConversation);
            if (conversation == null)
            {
                return new Response(HttpStatusCode.NotFound, "Conversation doesn't exist!");
            }
            if (idCurrentUser == conversation.idAccount1)
            {
                conversation.isDeletedBySender = true;
            }
            else if (idCurrentUser == conversation.idAccount2)
            {
                conversation.isDeletedByReceiver = true;
            }
            var messages = await _context.Messages.Where(x => x.idConversation == conversation.idConversation).ToListAsync();
            foreach (var message in messages)
            {
                if (idCurrentUser == message.idSender)
                {
                    message.isDeletedBySender = true;
                }
                else if (idCurrentUser == message.idReceiver)
                {
                    message.isDeletedByReceiver = true;
                }
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Delete conversation is success!");
        }

        /*------------------------------------------------------------Message------------------------------------------------------------*/

        [HttpGet("GetMessages/{idConversation}/{idCurrentUser}")]
        public async Task<Response> GetMessages(Guid idConversation, string idCurrentUser)
        {
            var messages = await _context.Messages.Where(x => x.idConversation == idConversation).ToListAsync();
            foreach (var message in messages)
            {
                messages = messages.Where(x => (x.idSender == idCurrentUser && x.isDeletedBySender == false) 
                                            || (x.idReceiver == idCurrentUser && x.isDeletedByReceiver == false)).ToList();
            }
            var result = _mapper.Map<List<ViewMessage>>(messages);
            await _chatHub.GetMessages(result);
            return new Response(HttpStatusCode.NoContent, "Conversation had been existed!", result);
        }

        [HttpPost("SendMessage/{idCurrentUser}/{idReceiver}/{idConversation}")]
        public async Task<Response> SendMessage(string idCurrentUser, string idReceiver, Guid idConversation, CreateUpdateMessage createUpdateMessage)
        {
            var message = new Message
            {
                idConversation = idConversation,
                idSender = idCurrentUser,
                idReceiver = idReceiver,
                content = createUpdateMessage.content,
                isDeletedBySender = false,
                isDeletedByReceiver = false,
                createdDate = DateTime.Now,
            };
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
            var result = _mapper.Map<ViewMessage>(message);
            await _chatHub.SendMessage(idCurrentUser, idReceiver, result);
            return new Response(HttpStatusCode.OK, "Send message is success!", result);
        }

        [HttpDelete("DeleteMessage/{idMessage}/{idCurrentUser}")]
        public async Task<Response> DeleteMessage(Guid idMessage, string idCurrentUser)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.idMessage == idMessage);
            if (message == null)
            {
                return new Response(HttpStatusCode.NotFound, "Message doesn't exist!");
            }
            if (idCurrentUser == message.idSender)
            {
                message.isDeletedBySender = true;
            }
            else if (idCurrentUser == message.idReceiver)
            {
                message.isDeletedByReceiver = true;
            }
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Delete message is success!");
        }

        [HttpDelete("RecallMessage/{idMessage}")]
        public async Task<Response> RecallMessage(string idCurrentUser, Guid idMessage)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(x => x.idMessage == idMessage);
            if (message == null)
            {
                return new Response(HttpStatusCode.NotFound, "Message doesn't exist!");
            }
            message.isRecall = true;
            await _context.SaveChangesAsync();
            await _chatHub.RecallMessage(idCurrentUser, idMessage);
            return new Response(HttpStatusCode.OK, "Recall message is success!");
        }
    }
}
