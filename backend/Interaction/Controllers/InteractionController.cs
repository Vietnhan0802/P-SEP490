using AutoMapper;
using BusinessObjects.Entities.Interaction;
using BusinessObjects.Enums.Interaction.Verification;
using BusinessObjects.ViewModels.Interaction;
using BusinessObjects.ViewModels.User;
using Interaction.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Interaction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InteractionController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public InteractionController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetNameUserCurrent/{idUser}")]
        private async Task<string> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);

            return user!;
        }

        /*------------------------------------------------------------Blog------------------------------------------------------------*/

        [HttpGet("GetAllVerificationsWaiting")]
        public async Task<Response> GetAllVerificationsWaiting()
        {
            var verifications = await _context.Verifications.Where(x => x.status == Status.Waiting).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications == null)
            {
                return new Response(HttpStatusCode.NoContent, "Verifications doesn't empty!");
            }
            var result = _mapper.Map<List<ViewVerification>>(verifications);
            foreach (var verification in result)
            {
                verification.fullName = await GetNameUserCurrent(verification.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Getall verifications is success!", result);
        }

        [HttpGet("GetAllVerificationsAcceptOrDeny")]
        public async Task<Response> GetAllVerificationsAcceptOrDeny()
        {
            var verifications = await _context.Verifications.Where(x => x.status == Status.Accept || x.status == Status.Deny).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (verifications == null)
            {
                return new Response(HttpStatusCode.NoContent, "Verifications doesn't empty!");
            }
            var result = _mapper.Map<List<ViewVerification>>(verifications);
            foreach (var verification in result)
            {
                verification.fullName = await GetNameUserCurrent(verification.idAccount!);
            }
            return new Response(HttpStatusCode.OK, "Getall verifications is success!", result);
        }

        [HttpPost("CreateVerification/{idUser}")]
        public async Task<Response> CreateVerification(string idUser)
        {
            if (ModelState.IsValid)
            {
                Verification verification = new Verification()
                {
                    idAccount = idUser,
                    status = Status.Waiting,
                    createdDate = DateTime.Now
                };
                await _context.Verifications.AddAsync(verification);
                await _context.SaveChangesAsync();
                return new Response(HttpStatusCode.OK, "Create verification is success!", _mapper.Map<ViewVerification>(verification));
            }
            return new Response(HttpStatusCode.BadRequest, "Create verification is fail!");
        }

        [HttpPut("UpdateVerification/{idVerification}")]
        public async Task<Response> UpdateVerification(Guid idVerification, Status status)
        {
            var verification = await _context.Verifications.FirstOrDefaultAsync(x => x.idVerification == idVerification);
            if (verification != null)
            {
                return new Response(HttpStatusCode.NotFound, "Verification doesn't exists!");
            }
            if (status == Status.Accept)
            {
                verification!.status = Status.Accept;
                verification.confirmedDate = DateTime.Now;
            }
            else
            {
                verification!.status = Status.Deny;
                verification.confirmedDate = DateTime.Now;
            }
            var result = await _context.SaveChangesAsync();
            if (result > 0)
            {
                return new Response(HttpStatusCode.OK, "Update status is success!", _mapper.Map<ViewVerification>(verification));
            }
            else
            {
                return new Response(HttpStatusCode.BadRequest, "Update status is fail!");
            }
        }
    }
}
