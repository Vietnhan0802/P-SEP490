using AutoMapper;
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
            return user;
        }

        [HttpGet("GetAllProjectApplications/{idProject}")]
        public async Task<Response> GetAllProjectApplications(Guid idProject)
        {
            var projectApplications = await _context.ProjectMembers
                .Include(x => x.ProjectInfo)
                .Where(x => x.idProject == idProject && x.type == BusinessObjects.Enums.Project.Type.Applied)
                .Select(x => new ProjectMemberView
                {
                    idProjectMember = x.idProjectMember,
                    idAccount = x.idAccount,
                    name = x.ProjectInfo.name,
                    createdDate = x.createdDate,
                })
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();           
            if (projectApplications == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Application doesn't exists!");
            }
            foreach (var projectApplication in projectApplications)
            {
                projectApplication.fullName = await GetNameUserCurrent(projectApplication.idAccount);
            }
            return new Response(HttpStatusCode.OK, "Get all project application success!", projectApplications);
        }
        [HttpGet("GetAllProjectInvites/{idProject}")]
        public async Task<Response> GetAllProjectInvites(Guid idProject)
        {
            var projectInvites = await _context.ProjectMembers
                .Include(x => x.ProjectInfo)
                .Where(x => x.idProject == idProject && x.type == BusinessObjects.Enums.Project.Type.Invited)
                .Select(x => new ProjectMemberView
                {
                    idProjectMember = x.idProjectMember,
                    idAccount = x.idAccount,
                    name = x.ProjectInfo.name,
                    createdDate = x.createdDate,
                })
                .OrderByDescending(x => x.createdDate)
                .AsNoTracking()
                .ToListAsync();
            if (projectInvites == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project Invite doesn't exists!");
            }
            foreach (var projectInvite in projectInvites)
            {
                projectInvite.fullName = await GetNameUserCurrent(projectInvite.idAccount);
            }
            return new Response(HttpStatusCode.OK, "Get all project invite success!", projectInvites);
        }

        [HttpPost("CreateProjectApplication/{idUser}/{idProject}")]
        public async Task<Response> CreateProjectApplication(string idUser, Guid idProject)
        {
            ProjectMember projectApplication = new ProjectMember()
            {
                idAccount = idUser,
                idProject = idProject,
                type = BusinessObjects.Enums.Project.Type.Applied,
                isAcept = null,
                createdDate = DateTime.Now
            };
            await _context.ProjectMembers.AddAsync(projectApplication);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create Project Application is success!", projectApplication);
        }

        [HttpPost("CreateProjectInvite/{idUser}/{idProject}")]
        public async Task<Response> CreateProjectInvite(string idUser, Guid idProject)
        {
            ProjectMember projectInvite = new ProjectMember()
            {
                idAccount = idUser,
                idProject = idProject,
                type = BusinessObjects.Enums.Project.Type.Invited,
                isAcept = null,
                createdDate = DateTime.Now
            };
            await _context.ProjectMembers.AddAsync(projectInvite);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create Project Invite is success!", projectInvite);
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

        [HttpDelete("RemoveMember/{idProject}/{idAccount}")]
        public async Task<Response> RemoveMember(Guid idProject, string idAccount)
        {
            var member = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idAccount == idAccount && x.idProject == idProject);
            if (member == null)
            {
                return new Response(HttpStatusCode.NotFound, "Member doesn't exists!");
            }
            _context.ProjectMembers.Remove(member);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove member is success!");
        }
    }
}
