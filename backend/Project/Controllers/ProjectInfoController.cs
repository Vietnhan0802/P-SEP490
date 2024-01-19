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
    public class ProjectInfoController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly HttpClient client;

        public string UserApiUrl { get; private set; }

        public ProjectInfoController(AppDBContext context, IMapper mapper)
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

        [HttpGet("GetAllProjects")]
        public async Task<Response> GetAllProjects()
        {
            var projects = await _context.ProjectInfos.Where(x => x.isDeleted == false && x.visibility == BusinessObjects.Enums.Project.Visibility.Public).OrderByDescending(x => x.createdDate).ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                project.fullName = await GetNameUserCurrent(project.idAccount);
            }
            return new Response(HttpStatusCode.OK, "Get all project success!", result);
        }

        [HttpGet("GetProjectByUser/{idUser}")]
        public async Task<Response> GetProjectByUser(string idUser)
        {
            var projects = await _context.ProjectInfos.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                project.fullName = await GetNameUserCurrent(idUser);
            }
            return new Response(HttpStatusCode.OK, "Get project by user success!", result);
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
            result.fullName = await GetNameUserCurrent(result.idAccount);
            return new Response(HttpStatusCode.OK, "Get project by is success!", result);
        }

        [HttpPost("CreateProject/{idUser}")]
        public async Task<Response> CreateProject(string idUser, ProjectInfoCreate projectInfoCreate)
        {
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
    }
}
