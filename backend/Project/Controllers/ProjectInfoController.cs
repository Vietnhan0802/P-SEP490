﻿using AutoMapper;
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

        [HttpGet("GetAllProjects")]
        public async Task<Response> GetAllProjects()
        {
            var projects = await _context.ProjectInfos.ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }

            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result )
            {
                project.idAccount = await GetNameUserCurrent(project.idAccount);
            }

            return new Response(HttpStatusCode.OK, "Get all project success!", result);
        }

        [HttpGet("GetProjectByUser/{userId}")]
        public async Task<Response> GetProjectByUser(string userId)
        {
            var userName = await GetNameUserCurrent(userId);

            var projects = await _context.ProjectInfos.Where(x => x.idAccount == userId && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }

            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                project.idAccount = await GetNameUserCurrent(userId);
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

            var userName = await GetNameUserCurrent(project.idAccount);
            project.idAccount = userName;

            return new Response(HttpStatusCode.OK, "Get project by is success!", _mapper.Map<ProjectInfoView>(project));
        }

        [HttpPost("CreateProject/{idAccount}")]
        public async Task<Response> CreateProject(string userId, ProjectInfoCreate projectInfoCreate)
        {
            var project = _mapper.Map<ProjectInfo>(projectInfoCreate);
            project.idAccount = userId;
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
