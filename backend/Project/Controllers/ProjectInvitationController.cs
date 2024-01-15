using BusinessObjects.Entities.Projects;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectInvitationController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public ProjectInvitationController(AppDBContext context)
        {
            _context = context;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetNameUserCurrent/{userId}")]
        private async Task<string> GetNameUserCurrent(string userId)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{userId}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<string>(strData, option);

            return user;
        }

        [HttpGet("GetAllProjectInvitations")]
        public async Task<Response> GetAllProjectInvitations()
        {
            var projectInvitations = await _context.ProjectInvitations
                .Include(x => x.Project)
                .Select(x => new ProjectInvitationView
            {
                idProjectInvitation = x.idProjectInvitation,
                idAccount = x.idAccount,
                idProject = x.idProject,
                projectName = x.Project.name,
                createdDate = DateTime.Now
            }).ToListAsync();
            foreach (var projectInvitation in projectInvitations)
            {
                projectInvitation.userName = await GetNameUserCurrent(projectInvitation.idAccount);
            }

            return new Response(HttpStatusCode.OK, "Get all project invitation success!", projectInvitations);
        }

        [HttpPost("CreateProjectInvitation/{userId}/{idProject}")]
        public async Task<Response> CreateProjectInvitation(string userId, Guid idProject)
        {
            ProjectInvitation projectInvitation = new ProjectInvitation()
            {
                idAccount = userId,
                idProject = idProject,
                createdDate = DateTime.Now
            };
            await _context.ProjectInvitations.AddAsync(projectInvitation);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Create Project Invitation is success!", projectInvitation);
        }

        [HttpPut("AcceptProjectInvitation/{idProjectInvitation}")]
        public async Task<Response> AcceptProjectInvitation (Guid idProjectInvitation)
        {
            var projectInvitation = await _context.ProjectInvitations.FirstOrDefaultAsync(x => x.idProjectInvitation == idProjectInvitation);

            if (projectInvitation == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Invitation doesn't exists!");
            }

            projectInvitation.isAccept = true;
            projectInvitation.confirmedDate = DateTime.Now;
            _context.ProjectInvitations.Update(projectInvitation);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Accept Project Invitation is success!", projectInvitation);
        }

        [HttpPut("DenyProjectInvitation/{idProjectInvitation}")]
        public async Task<Response> DenyProjectInvitation(Guid idProjectInvitation)
        {
            var projectInvitation = await _context.ProjectInvitations.FirstOrDefaultAsync(x => x.idProjectInvitation == idProjectInvitation);

            if (projectInvitation == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Invitation doesn't exists!");
            }

            projectInvitation.isAccept = false;
            projectInvitation.confirmedDate = DateTime.Now;
            _context.ProjectInvitations.Update(projectInvitation);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Deny Project Invitation is success!", projectInvitation);
        }
    }
}
