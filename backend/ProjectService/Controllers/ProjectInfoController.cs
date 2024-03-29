﻿using AutoMapper;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Enums.Project;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectService.Data;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace ProjectService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectInfoController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string NotifyApiUrl { get; }
        public string UserApiUrl { get; private set; }

        public ProjectInfoController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
        {
            _context = context;
            _mapper = mapper;
            _saveImageService = saveImageService;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            NotifyApiUrl = "https://localhost:7009/api/Notification";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------CallAPI------------------------------------------------------------*/

        [HttpPost("CreateNotificationProjectApply/{idSender}/{idReceiver}/{idPorject}")]
        private async Task<IActionResult> CreateNotificationProjectApply(string idSender, string idReceiver, Guid idPorject)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationProjectApply/{idSender}/{idReceiver}/{idPorject}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
        }

        [HttpPost("CreateNotificationProjectInvite/{idSender}/{idReceiver}/{idPorject}")]
        private async Task<IActionResult> CreateNotificationProjectInvite(string idSender, string idReceiver, Guid idPorject)
        {
            HttpResponseMessage response = await client.PostAsync($"{NotifyApiUrl}/CreateNotificationProjectInvite/{idSender}/{idReceiver}/{idPorject}", null);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Create notification is successfully!");
            }
            return BadRequest("Create notification is fail!");
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

        /*------------------------------------------------------------HaveBeenCalled------------------------------------------------------------*/

        [HttpGet("GetTotalProjects/{idUser}")]
        public async Task<int> GetTotalProjects(string idUser)
        {
            var totalProject = await _context.Projects.CountAsync(x => x.idAccount == idUser);
            if (totalProject > 0)
            {
                return totalProject;
            }
            return 0;
        }

        /*------------------------------------------------------------Statistic------------------------------------------------------------*/

        [HttpGet("GetProjectStatistic")]
        public async Task<List<ViewStatistic>> GetProjectStatistic(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null)
            {
                startDate = DateTime.Today.AddDays(-30);
            }
            if (endDate == null)
            {
                endDate = new DateTime(3999, 1, 1);
            }

            var projectStatistic = await _context.Projects.Where(x => x.createdDate >= startDate && x.createdDate <= endDate)
                .GroupBy(x => x.createdDate.Date)
                .Select(result => new ViewStatistic
                {
                    dateTime = result.Key,
                    count = result.Count()
                })
                .OrderBy(x => x.dateTime).ToListAsync();
            return projectStatistic;
        }

        /*------------------------------------------------------------ProjectInfo------------------------------------------------------------*/

        [HttpGet("GetAllProjects")]
        public async Task<Response> GetAllProjects()
        {
            var projects = await _context.Projects.Where(x => x.isDeleted == false).OrderByDescending(x => x.createdDate).ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NoContent, "Project list is empty!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                var infoUser = await GetInfoUser(project.idAccount);
                project.fullName = infoUser.fullName;
                project.avatarUser = infoUser.avatar;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetAllPublicProjects")]
        public async Task<Response> GetAllPublicProjects()
        {
            var projects = await _context.Projects.Where(x => x.isDeleted == false && x.visibility == BusinessObjects.Enums.Project.Visibility.Public).OrderByDescending(x => x.createdDate).ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NoContent, "Project list is empty!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                var infoUser = await GetInfoUser(project.idAccount!);
                project.fullName = infoUser.fullName;
                project.avatarUser = infoUser.avatar;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetProjectByMember/{idUser}")]
        public async Task<Response> GetProjectByMember(string idUser)
        {
            var member = await _context.ProjectMembers.Where(x => x.idAccount == idUser && x.isAcept == true)
                                                      .OrderByDescending(x => x.createdDate)
                                                      .AsNoTracking()
                                                      .ToListAsync();
            if (member.Count != 0)
            {
                var result = _mapper.Map<List<ProjectInfoView>>(member);
                foreach (var projectMember in result)
                {
                    var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == projectMember.idProject);
                    var inforUser = await GetInfoUser(project.idAccount);
                    projectMember.fullName = inforUser.fullName;
                    projectMember.avatarUser = inforUser.avatar;
                    projectMember.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                    var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                    var viewPosition = _mapper.Map<List<PositionView>>(positions);
                    projectMember.PositionViews = viewPosition;
                }
                return new Response(HttpStatusCode.OK, "Get project list is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Project list is empty!");
        }

        [HttpGet("GetProjectByUser/{idUser}")]
        public async Task<Response> GetProjectByUser(string idUser)
        {
            var projects = await _context.Projects.Where(x => x.idAccount == idUser && x.isDeleted == false).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (projects == null)
            {
                return new Response(HttpStatusCode.NoContent, "Project list is empty!");
            }
            var result = _mapper.Map<List<ProjectInfoView>>(projects);
            foreach (var project in result)
            {
                var infoUser = await GetInfoUser(project.idAccount!);
                project.fullName = infoUser.fullName;
                project.avatarUser = infoUser.avatar;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetProjectById/{idProject}")]
        public async Task<Response> GetProjectById(Guid idProject)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == idProject && x.isDeleted == false);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            var result = _mapper.Map<ProjectInfoView>(project);
            var infoUser = await GetInfoUser(result.idAccount!);
            result.fullName = infoUser.fullName;
            result.avatarUser = infoUser.avatar;
            result.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
            var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
            var viewPosition = _mapper.Map<List<PositionView>>(positions);
            result.PositionViews = viewPosition;
            return new Response(HttpStatusCode.OK, "Get project is success!", result);
        }

        [HttpGet("GetAllMemberInProject/{idProject}")]
        public async Task<Response> GetAllMemberInProject(Guid idProject)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == idProject);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            var members = await _context.ProjectMembers.Where(x => x.idProject == idProject && x.isAcept == true).OrderByDescending(x => x.createdDate).ToListAsync();
            if (members.Count > 0)
            {
                var result = _mapper.Map<List<ProjectMemberView>>(members);
                foreach (var member in result)
                {
                    var infoUser = await GetInfoUser(member.idAccount!);
                    member.fullName = infoUser.fullName;
                    member.avatar = infoUser.avatar;
                    var postion = await _context.Positions.FirstOrDefaultAsync(x => x.idPosition == member.idPosition);
                    member.namePosition = postion.namePosition;
                }
                return new Response(HttpStatusCode.OK, "Get member in project is success!", result);
            }
            return new Response(HttpStatusCode.BadRequest, "Get member in project is empty!");
        }

        [HttpPost("CreateProject/{idUser}")]
        public async Task<Response> CreateProject(string idUser, [FromForm] ProjectInfoCreate projectInfoCreate)
        {
            /*var validator = new ProjectCreateValidator();
            var validatorResult = validator.Validate(projectInfoCreate);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            projectInfoCreate.avatar = await _saveImageService.SaveImage(projectInfoCreate.ImageFile);
            var project = _mapper.Map<BusinessObjects.Entities.Projects.Project>(projectInfoCreate);
            project.idAccount = idUser;
            project.process = Process.Preparing;
            project.isDeleted = false;
            project.createdDate = DateTime.Now;
            await _context.Projects.AddAsync(project);
            foreach (var position in projectInfoCreate.namePosition)
            {
                Position newPosition = new Position()
                {
                    idProject = project.idProject,
                    namePosition = position
                };
                await _context.Positions.AddAsync(newPosition);
            }
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                var result = _mapper.Map<ProjectInfoView>(project);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                result.PositionViews = viewPosition;
                return new Response(HttpStatusCode.OK, "Create project is success!", result);
            }
            return new Response(HttpStatusCode.BadRequest, "Create project is fail!");
        }

        [HttpPut("UpdateProject/{idProject}")]
        public async Task<Response> UpdateProject(Guid idProject, [FromForm] ProjectInfoUpdate projectInfoUpdate)
        {
            /*var validator = new ProjectUpdateValidator();
            var validatorResult = validator.Validate(projectInfoUpdate);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var project = await _context.Projects.Include(x => x.Positions).FirstOrDefaultAsync(p => p.idProject == idProject);
            if (project != null)
            {
                if (projectInfoUpdate.ImageFile != null)
                {
                    if (project.avatar != null)
                    {
                        _saveImageService.DeleteImage(project.avatar);
                    }
                    projectInfoUpdate.avatar = await _saveImageService.SaveImage(projectInfoUpdate.ImageFile);
                }
                if (projectInfoUpdate.ImageFile == null)
                {
                    projectInfoUpdate.avatar = project.avatar;
                }
                if (projectInfoUpdate.namePosition != null)
                {
                    if (project.Positions != null)
                    {
                        _context.Positions.RemoveRange(project.Positions);
                        await _context.SaveChangesAsync();
                    }
                    foreach (var position in projectInfoUpdate.namePosition)
                    {
                        Position newPosition = new Position()
                        {
                            idProject = project.idProject,
                            namePosition = position
                        };
                        await _context.Positions.AddAsync(newPosition);
                        await _context.SaveChangesAsync();
                    }
                }
                _mapper.Map(projectInfoUpdate, project);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    var result = _mapper.Map<ProjectInfoView>(project);
                    var positionNew = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                    var viewPosition = _mapper.Map<List<PositionView>>(positionNew);
                    result.PositionViews = viewPosition;
                    return new Response(HttpStatusCode.OK, "Update project is success!", result);
                }
                return new Response(HttpStatusCode.BadRequest, "Update project is fail!");
            }
            return new Response(HttpStatusCode.BadRequest, "Project doesn't exists!");
        }

        [HttpDelete("RemoveProject/{idProject}")]
        public async Task<Response> RemoveProject(Guid idProject)
        {
            var project = await _context.Projects.FirstOrDefaultAsync(p => p.idProject == idProject);
            if (project == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project doesn't exists!");
            }
            project.isDeleted = true;
            _context.Projects.Update(project);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove project is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove project is fail!");
        }

        /*------------------------------------------------------------ProjectMember------------------------------------------------------------*/

        [HttpGet("GetAllProjectApplications/{idUser}")]
        public async Task<Response> GetAllProjectApplications(string idUser)
        {
            var projects = await _context.Projects.Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            if (projects.Count != 0)
            {
                List<ProjectMemberView> allProjectApplications = new List<ProjectMemberView>();
                foreach (var project in projects)
                {
                    var projectApplications = await _context.ProjectMembers.Where(x => x.idProject == project.idProject && x.type == BusinessObjects.Enums.Project.Type.Applied && x.isAcept == null)
                                                                           .OrderByDescending(x => x.createdDate)
                                                                           .AsNoTracking()
                                                                           .ToListAsync();
                    if (projectApplications.Count != 0)
                    {
                        var result = _mapper.Map<List<ProjectMemberView>>(projectApplications);
                        foreach (var projectApplication in result)
                        {
                            var infoUser = await GetInfoUser(projectApplication.idAccount);
                            projectApplication.fullName = infoUser.fullName;
                            projectApplication.email = infoUser.email;
                            projectApplication.avatar = infoUser.avatar;
                            projectApplication.nameProject = project.name;
                            projectApplication.cvUrlFile = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, projectApplication.cvUrl);
                            var positionName = await _context.Positions.Where(x => x.idProject == projectApplication.idProject).AsNoTracking().ToListAsync();
                            foreach (var position in positionName)
                            {
                                projectApplication.namePosition = position.namePosition;
                            }
                        }
                        allProjectApplications.AddRange(result);
                    }
                }
                if (allProjectApplications.Count != 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Get all project application is success!", allProjectApplications);
                }
                return new Response(HttpStatusCode.NoContent, "Get all project application is empty!");
            }
            return new Response(HttpStatusCode.NoContent, "Get all project is empty!");
        }

        [HttpGet("GetAllSendInvites/{idUser}")]
        public async Task<Response> GetAllSendInvites(string idUser)
        {
            var projects = await _context.Projects.Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            if (projects.Count != 0)
            {
                List<ProjectMemberView> allProjectInvites = new List<ProjectMemberView>();
                foreach (var project in projects)
                {
                    var sendInvites = await _context.ProjectMembers.Where(x => x.idProject == project.idProject && x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == null)
                                                                           .OrderByDescending(x => x.createdDate)
                                                                           .AsNoTracking()
                                                                           .ToListAsync();
                    if (sendInvites.Count != 0)
                    {
                        var result = _mapper.Map<List<ProjectMemberView>>(sendInvites);
                        foreach (var sendInvite in result)
                        {
                            var infoUser = await GetInfoUser(sendInvite.idAccount);
                            sendInvite.fullName = infoUser.fullName;
                            sendInvite.email = infoUser.email;
                            sendInvite.avatar = infoUser.avatar;
                            sendInvite.nameProject = project.name;
                            sendInvite.cvUrlFile = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, sendInvite.cvUrl);
                            var positionName = await _context.Positions.FirstOrDefaultAsync(x => x.idPosition == sendInvite.idPosition);
                            sendInvite.namePosition = positionName.namePosition;
                        }
                        allProjectInvites.AddRange(result);
                    }
                }
                if (allProjectInvites.Count != 0)
                {
                    return new Response(HttpStatusCode.NoContent, "Get all send invite is success!", allProjectInvites);
                }
                return new Response(HttpStatusCode.NoContent, "Get all send invite is empty!");
            }
            return new Response(HttpStatusCode.NoContent, "Get all project is empty!");
        }

        [HttpGet("GetAllProjectInvites/{idUser}")]
        public async Task<Response> GetAllProjectInvites(string idUser)
        {
            var projectInvites = await _context.ProjectMembers.Include(x => x.Position).Where(x => x.idAccount == idUser && x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == null)
                                                                           .OrderByDescending(x => x.createdDate)
                                                                           .AsNoTracking()
                                                                           .ToListAsync();
            if (projectInvites.Count != 0)
            {
                var result = _mapper.Map<List<ProjectMemberView>>(projectInvites);
                foreach (var projectInvite in result)
                {
                    var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == projectInvite.idProject);
                    var infoUser = await GetInfoUser(project.idAccount);
                    projectInvite.fullName = infoUser.fullName;
                    projectInvite.avatar = infoUser.avatar;
                    projectInvite.nameProject = project.name;
                    projectInvite.cvUrlFile = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, projectInvite.cvUrl);
                    foreach (var position in projectInvites)
                    {
                        projectInvite.namePosition = position.Position.namePosition;
                    }
                }
                return new Response(HttpStatusCode.OK, "Get all project invite is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all project invite is empty!");
        }

        [HttpGet("GetAllSendApplications/{idUser}")]
        public async Task<Response> GetAllSendApplications(string idUser)
        {
            var projectApplications = await _context.ProjectMembers.Include(x => x.Position).Where(x => x.idAccount == idUser && x.type == BusinessObjects.Enums.Project.Type.Applied && x.isAcept == null)
                                                                           .OrderByDescending(x => x.createdDate)
                                                                           .AsNoTracking()
                                                                           .ToListAsync();
            if (projectApplications.Count != 0)
            {
                var result = _mapper.Map<List<ProjectMemberView>>(projectApplications);
                foreach (var projectApplication in result)
                {
                    var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == projectApplication.idProject);
                    var infoUser = await GetInfoUser(project.idAccount);
                    projectApplication.fullName = infoUser.fullName;
                    projectApplication.avatar = infoUser.avatar;
                    projectApplication.nameProject = project.name;
                    projectApplication.cvUrlFile = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, projectApplication.cvUrl);
                    foreach (var position in projectApplications)
                    {
                        projectApplication.namePosition = position.Position.namePosition;
                    }
                }
                return new Response(HttpStatusCode.OK, "Get all send apply is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all send apply is empty!");
        }

        [HttpPost("CreateProjectApplication/{idUser}/{idProject}")]
        public async Task<Response> CreateProjectApplication(string idUser, Guid idProject, [FromForm] ProjectMemberCreateUpdate projectMemberCreateUpdate)
        {
            /*var validator = new ProjectMemberValidator();
            var validatorResult = validator.Validate(projectMemberCreateUpdate);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var existApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProject == idProject && x.idAccount == idUser);
            if (existApplication == null)
            {
                projectMemberCreateUpdate.cvUrl = await _saveImageService.SaveImage(projectMemberCreateUpdate.cvUrlFile);
                var projectApplication = _mapper.Map<ProjectMember>(projectMemberCreateUpdate);
                projectApplication.idAccount = idUser;
                projectApplication.idProject = idProject;
                projectApplication.type = BusinessObjects.Enums.Project.Type.Applied;
                projectApplication.isAcept = null;
                projectApplication.createdDate = DateTime.Now;
                await _context.ProjectMembers.AddAsync(projectApplication);
                var isSuucess = await _context.SaveChangesAsync();
                if (isSuucess > 0)
                {
                    var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == idProject);
                    await CreateNotificationProjectApply(idUser, project.idAccount, idProject);
                    return new Response(HttpStatusCode.NoContent, "Create project application is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Create project application is fail!");
            }
            return new Response(HttpStatusCode.BadRequest, "Project application is exist!");
        }

        [HttpPost("CreateProjectInvite/{idUser}")]
        public async Task<Response> CreateProjectInvite(string idUser, Guid idProject, Guid idPosition)
        {
            var existInvitation = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProject == idProject && x.idAccount == idUser);
            if (existInvitation == null)
            {
                ProjectMember projectApplication = new ProjectMember
                {
                    idPosition = idPosition,
                    idAccount = idUser,
                    idProject = idProject,
                    type = BusinessObjects.Enums.Project.Type.Invited,
                    isAcept = null,
                    createdDate = DateTime.Now
                };

                await _context.ProjectMembers.AddAsync(projectApplication);
                var isSuucess = await _context.SaveChangesAsync();
                if (isSuucess > 0)
                {
                    var project = await _context.Projects.FirstOrDefaultAsync(x => x.idProject == idProject);
                    await CreateNotificationProjectInvite(project.idAccount, idUser, idProject);
                    return new Response(HttpStatusCode.NoContent, "Create project invite is success!");
                }
                return new Response(HttpStatusCode.BadRequest, "Create project invite is fail!");
            }
            return new Response(HttpStatusCode.BadRequest, "Project invitation is exist!");
        }

        [HttpPut("AcceptProjectApplication/{idProjectMember}")]
        public async Task<Response> AcceptProjectApplication(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Applied && x.isAcept == null);
            if (projectApplication == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project application doesn't exists!");
            }
            projectApplication.isAcept = true;
            projectApplication.confirmedDate = DateTime.Now;
            _context.ProjectMembers.Update(projectApplication);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Accept project application is success!", projectApplication);
            }
            return new Response(HttpStatusCode.BadRequest, "Accept project application is fail!");
        }

        [HttpPut("AcceptProjectInvitation/{idProjectMember}")]
        public async Task<Response> AcceptProjectInvitation(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == null);
            if (projectApplication == null)
            {
                return new Response(HttpStatusCode.NotFound, "Project invitation doesn't exists!");
            }
            projectApplication.isAcept = true;
            projectApplication.confirmedDate = DateTime.Now;
            _context.ProjectMembers.Update(projectApplication);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Accept invitation application is success!", projectApplication);
            }
            return new Response(HttpStatusCode.BadRequest, "Accept invitation application is fail!");
        }

        [HttpPut("DenyProjectApplication/{idProjectMember}")]
        public async Task<Response> DenyProjectApplication(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Applied && x.isAcept == null);
            if (projectApplication != null)
            {
                _context.ProjectMembers.Remove(projectApplication);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Deny project application is success!", projectApplication);
                }
                return new Response(HttpStatusCode.OK, "Deny project application is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Project Application doesn't exists!");
        }

        [HttpPut("DenyProjectInvitation/{idProjectMember}")]
        public async Task<Response> DenyProjectInvitation(Guid idProjectMember)
        {
            var projectApplication = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == null);
            if (projectApplication != null)
            {
                _context.ProjectMembers.Remove(projectApplication);
                var isSuccess = await _context.SaveChangesAsync();
                if (isSuccess > 0)
                {
                    return new Response(HttpStatusCode.OK, "Deny project invitation is success!", projectApplication);
                }
                return new Response(HttpStatusCode.OK, "Deny project invitation is fail!");
            }
            return new Response(HttpStatusCode.NotFound, "Project invitation doesn't exists!");
        }

        [HttpDelete("RemoveApply/{idProjectMember}")]
        public async Task<Response> RemoveApply(Guid idProjectMember)
        {
            var member = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Applied && x.isAcept == null); ;
            if (member == null)
            {
                return new Response(HttpStatusCode.NotFound, "Apply doesn't exists!");
            }
            _context.ProjectMembers.Remove(member);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove apply is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove apply is fail!");
        }

        [HttpDelete("RemoveInvite/{idProjectMember}")]
        public async Task<Response> RemoveInvite(Guid idProjectMember)
        {
            var member = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == null);
            if (member == null)
            {
                return new Response(HttpStatusCode.NotFound, "Invite doesn't exists!");
            }
            _context.ProjectMembers.Remove(member);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove invite is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove invite is fail!");
        }

        [HttpDelete("RemoveMember/{idProjectMember}")]
        public async Task<Response> RemoveMember(Guid idProjectMember)
        {
            var member = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.isAcept == true);
            if (member == null)
            {
                return new Response(HttpStatusCode.NotFound, "Member doesn't exists!");
            }
            _context.ProjectMembers.Remove(member);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove member is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove member is fail!");
        }
    }
}
