using AutoMapper;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Projects;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectMemberController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string UserApiUrl { get; }

        public ProjectMemberController(AppDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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

        [HttpGet("GetAllProjectApplications")]
        public async Task<Response> GetAllProjectApplications(Guid idProject)
        {
            var projectApplications = await _context.ProjectMembers.Include(x => x.Project).Where(x => x.idProject == idProject).ToListAsync();
            if (projectApplications == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Application doesn't exists!");
            }

            var result = projectApplications.Select(async x => new 
            {
                userName = await GetNameUserCurrent(x.idAccount),
                x.idProject,
                name = x.Project?.name,
                x.isAcept,
                x.createdDate
            });

            return new Response(HttpStatusCode.OK, "Get all project application success!", result);
        }

        [HttpPost("CreateProjectApplication/{userId}/{idProject}")]
        public async Task<Response> CreateProjectApplication(string userId, Guid idProject)
        {
            ProjectMember projectApplication = new ProjectMember()
            {
                idAccount = userId,
                idProject = idProject,
                createdDate = DateTime.Now
            };
            await _context.ProjectMembers.AddAsync(projectApplication);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Create Project Application is success!", projectApplication);
        }

        [HttpPut("AcceptProjectApplication/{idProjectMember}")]
        public async Task<Response> AcceptProjectApplication(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember);
            if (projectApplication == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Application doesn't exists!");
            }

            projectApplication.isAcept = true;
            projectApplication.confirmedDate = DateTime.Now;
            _context.ProjectMembers.Update(projectApplication);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Accept Project Application is success!", projectApplication);
        }

        [HttpPut("DenyProjectApplication/{idProjectMember}")]
        public async Task<Response> DenyProjectApplication(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember);
            if (projectApplication == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Application doesn't exists!");
            }

            projectApplication.isAcept = false;
            projectApplication.confirmedDate = DateTime.Now;
            _context.ProjectMembers.Update(projectApplication);
            await _context.SaveChangesAsync();

            return new Response(HttpStatusCode.OK, "Deny Project Application is success!", projectApplication);
        }
    }
}
