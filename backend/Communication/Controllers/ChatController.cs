﻿using AutoMapper;
using BusinessObjects.Entities.Communication;
using BusinessObjects.ViewModels.Communication;
using BusinessObjects.ViewModels.User;
using Communication.Data;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Communication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigins")]
    public class ChatController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public ChatController(AppDBContext context, IMapper mapper, IHubContext<ChatHub> chatHub)
        {
            _context = context;
            _mapper = mapper;
            _chatHub = chatHub;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetInfoUser/{idUser}")]
        private async Task<ViewUser> GetInfoUser(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetInfoUser/{idUser}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

                return user;
            }
            return null;
        }

        /*------------------------------------------------------------Conversation------------------------------------------------------------*/

        [HttpGet("GetConversationsByUser/{idCurrentUser}")]
        public async Task<Response> GetConversationsByUser(string idCurrentUser)
        {
            var conversations = await _context.Conversations.Where(x => (x.idAccount1 == idCurrentUser && x.isDeletedBySender == false) 
                                                                     || (x.idAccount2 == idCurrentUser && x.isDeletedByReceiver == false)).OrderByDescending(x => x.createdDate).ToListAsync();
            if (conversations.Count > 0)
            {
                var result = _mapper.Map<List<ViewConversation>>(conversations);
                foreach (var conversation in result)
                {
                    if (idCurrentUser == conversation.idAccount2)
                    {
                        var infoUser = await GetInfoUser(conversation.idAccount1);
                        conversation.fullName = infoUser.fullName;
                        conversation.avatar = infoUser.avatar;
                    }
                    else
                    {
                        var infoUser = await GetInfoUser(conversation.idAccount2);
                        conversation.fullName = infoUser.fullName;
                        conversation.avatar = infoUser.avatar;
                    }
                }
                return new Response(HttpStatusCode.OK, "Get all conversations is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Conversation doesn't empty!");
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
                //await _chatHub.Clients.User(idReceiver).SendAsync("StartConversation", idCurrentUser);
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
            var messages = await _context.Messages.Where(x => x.idConversation == idConversation).OrderBy(x => x.createdDate).ToListAsync();
            if (messages.Count > 0)
            {
                var result = _mapper.Map<List<ViewMessage>>(messages);
                foreach (var message in result)
                {
                    if (message.idSender == idCurrentUser)
                    {
                        message.isYourself = true;
                        var infoSender = await GetInfoUser(message.idSender);
                        message.nameReceiver = infoSender.fullName;
                    }
                    else
                    {
                        message.isYourself = false;
                        var infoReceiver = await GetInfoUser(message.idSender);
                        message.nameReceiver = infoReceiver.fullName;
                        message.avatarReceiver = infoReceiver.avatar;
                    }
                }
                return new Response(HttpStatusCode.OK, "Get message is success!", result);
            }
            //await _chatHub.GetMessages(result);
            return new Response(HttpStatusCode.NoContent, "Get message is fail!");
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
            //await _chatHub.SendMessage(idCurrentUser, idReceiver, result);
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
            //await _chatHub.RecallMessage(idCurrentUser, idMessage);
            return new Response(HttpStatusCode.OK, "Recall message is success!");
        }
    }
}
