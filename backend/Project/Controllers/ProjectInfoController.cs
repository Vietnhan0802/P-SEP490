using AutoMapper;
using BusinessObjects.Entities.Credential;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Enums.Project;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
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
    public class ProjectInfoController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string UserApiUrl { get; private set; }

        public ProjectInfoController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
        {
            _context = context;
            _mapper = mapper;
            _saveImageService = saveImageService;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";
        }

        [HttpGet("GetNameUserCurrent/{idUser}")]
        private async Task<ViewUser> GetNameUserCurrent(string idUser)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetNameUser/{idUser}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var user = JsonSerializer.Deserialize<ViewUser>(strData, option);

            return user!;
        }

        [HttpGet("GetTotalProjects")]
        public async Task<Response> GetTotalProjects()
        {
            var totalProjects = await _context.ProjectInfos.CountAsync(x => x.isDeleted == false);
            return new Response(HttpStatusCode.OK, "Get total projects is success!", totalProjects);
        }

        [HttpGet("GetAllNewProjects/{interval}")]
        public async Task<Response> GetAllNewProjects(string interval)
        {
            DateTime startDate = DateTime.Now.Date;
            DateTime endDate;

            switch (interval.ToLower())
            {
                case "day":
                    endDate = startDate;
                    break;
                case "week":
                    endDate = startDate.AddDays(-(int)startDate.DayOfWeek);
                    break;
                case "month":
                    endDate = new DateTime(startDate.Year, startDate.Month, 1);
                    break;
                default:
                    return new Response(HttpStatusCode.BadRequest, "Invalid interval parameter!");
            }

            var newProjects = await _context.ProjectInfos.CountAsync(x => x.isDeleted == false && x.createdDate == endDate);
            return new Response(HttpStatusCode.OK, $"Get new projects count for {interval} success!", newProjects);
        }

        [HttpGet("GetProjectsByProcess/{process}")]
        public async Task<Response> GetProjectsByProcess(Process process)
        {
            var projects = await _context.ProjectInfos.Where(x => x.process == process && x.isDeleted == false).CountAsync();
            return new Response(HttpStatusCode.OK, "Get project count by process is success!", projects);
        }

        [HttpGet("GetAllProjects")]
        public async Task<Response> GetAllProjects()
        {
            var projects = await _context.ProjectInfos.Where(x => x.isDeleted == false && x.visibility == BusinessObjects.Enums.Project.Visibility.Public).OrderByDescending(x => x.createdDate).ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NoContent, "Project list is empty!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                var infoUser = await GetNameUserCurrent(project.idAccount!);
                project.fullName = infoUser.fullName;
                project.avatarUser = infoUser.avatar;
                project.avatar = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetProjectByUser/{idUser}")]
        public async Task<Response> GetProjectByUser(string idUser)
        {
            var projects = await _context.ProjectInfos.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NoContent, "Project list is empty!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                var infoUser = await GetNameUserCurrent(project.idAccount!);
                project.fullName = infoUser.fullName;
                project.avatarUser = infoUser.avatar;
                project.avatar = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetProjectById/{idProject}")]
        public async Task<Response> GetProjectById(Guid idProject)
        {
            var project = await _context.ProjectInfos.FirstOrDefaultAsync(x => x.idProject == idProject);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            var result = _mapper.Map<ProjectInfoView>(project);
            var infoUser = await GetNameUserCurrent(result.idAccount!);
            result.fullName = infoUser.fullName;
            result.avatarUser = infoUser.avatar;
            result.avatar = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
            return new Response(HttpStatusCode.OK, "Get project is success!", result);
        }

        [HttpPost("CreateProject/{idUser}")]
        public async Task<Response> CreateProject(string idUser, [FromForm] ProjectInfoCreate projectInfoCreate)
        {
            if (projectInfoCreate.ImageFile != null)
            {
                projectInfoCreate.avatar = await _saveImageService.SaveImage(projectInfoCreate.ImageFile);
            }
            var project = _mapper.Map<ProjectInfo>(projectInfoCreate);
            project.idAccount = idUser;
            project.isDeleted = false;
            project.createdDate = DateTime.Now;
            await _context.ProjectInfos.AddAsync(project);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create project is success!", _mapper.Map<ProjectInfoView>(project));
        }

        [HttpPut("UpdateProject/{idProject}")]
        public async Task<Response> UpdateProject(Guid idProject, ProjectInfoUpdate projectInfoUpdate)
        {
            var project = await _context.ProjectInfos.FirstOrDefaultAsync(p => p.idProject == idProject);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            if (project.avatar != null)
            {
                _saveImageService.DeleteImage(project.avatar);
            }
            if (projectInfoUpdate.ImageFile != null)
            {
                projectInfoUpdate.avatar = await _saveImageService.SaveImage(projectInfoUpdate.ImageFile);
            }
            _mapper.Map(projectInfoUpdate, project);
            _context.ProjectInfos.Update(project);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update project is success!", _mapper.Map<ProjectInfoView>(project));
        }

        [HttpDelete("RemoveProject/{idProject}")]
        public async Task<Response> RemoveProject(Guid idProject)
        {
            var project = await _context.ProjectInfos.FirstOrDefaultAsync(p => p.idProject == idProject);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            project.isDeleted = true;
            _context.ProjectInfos.Update(project);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove Project success!");
        }

        [HttpGet("GetTotalProjectsByBusiness")]
        public async Task<Response> GetTotalProjectsByBusiness(string idUser)
        {
            var totalProject = await _context.ProjectInfos.CountAsync(x => x.idAccount == idUser);
            return new Response(HttpStatusCode.OK, "Get total projects is success!", totalProject);
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
                var infoUser = await GetNameUserCurrent(projectApplication.idAccount!);
                projectApplication.fullName = infoUser.fullName;
                projectApplication.avatar = infoUser.avatar;
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
                var infoUser = await GetNameUserCurrent(projectInvite.idAccount!);
                projectInvite.fullName = infoUser.fullName;
                projectInvite.avatar = infoUser.avatar;
            }
            return new Response(HttpStatusCode.OK, "Get all project invite success!", projectInvites);
        }

        [HttpPost("CreateProjectApplication/{idUser}/{idProject}/{cvUrl}")]
        public async Task<Response> CreateProjectApplication(string idUser, Guid idProject, string cvUrl)
        {
            ProjectMember projectApplication = new ProjectMember()
            {
                idAccount = idUser,
                idProject = idProject,
                type = BusinessObjects.Enums.Project.Type.Applied,
                cvUrl = cvUrl,
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
