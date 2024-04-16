using AutoMapper;
using BusinessObjects.Entities.Projects;
using BusinessObjects.Enums.Project;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.Project;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectService.Data;
using System.Globalization;
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

        [HttpGet("GetAllBusiness")]
        private async Task<List<ViewUser>> GetAllBusiness()
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetAllBusiness");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var user = JsonSerializer.Deserialize<List<ViewUser>>(strData, option);

                return user;
            }
            return null;
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

        [HttpGet("GetRatingAvgBusiness/{idUser}")]
        public async Task<double> GetRatingAvgBusiness(string idUser)
        {
            var projects = await _context.Projects.Include(x => x.Ratings).Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            if (projects.Count > 0)
            {
                var projectRatings = projects.Where(x => x.Ratings != null).SelectMany(x => x.Ratings.Select(x => x.rating));
                return projectRatings.Average();
            }
            return 0;
        }

        [HttpGet("GetRatingNumBusiness/{idUser}")]
        public async Task<double> GetRatingNumBusiness(string idUser)
        {
            var projects = await _context.Projects.Include(x => x.Ratings).Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            if (projects.Count > 0)
            {
                var projectRatings = projects.Where(x => x.Ratings != null).SelectMany(x => x.Ratings.Select(x => x.rating));
                return projectRatings.Count();
            }
            return 0;
        }

        [HttpGet("GetRatingAvg/{idUser}")]
        public async Task<double> GetRatingAvg(string idUser)
        {
            var ratingAvg = await _context.Ratings.Where(x => x.idRated == idUser).Select(x => x.rating).ToListAsync();
            if (ratingAvg.Count > 0)
            {
                return ratingAvg.Average();
            }
            return 0;
        }

        [HttpGet("GetRatingNum/{idUser}")]
        public async Task<int> GetRatingNum(string idUser)
        {
            var ratingAvg = await _context.Ratings.Where(x => x.idRated == idUser).Select(x => x.rating).ToListAsync();
            if (ratingAvg.Count > 0)
            {
                return ratingAvg.Count();
            }
            return 0;
        }

        /*------------------------------------------------------------Statistic------------------------------------------------------------*/

        [HttpGet("GetTop3Business")]
        public async Task<List<ViewBusinessStatistic>> GetTop3Business()
        {
            var businessList = await GetAllBusiness();

            var projects = await _context.Projects.Include(x => x.Ratings).AsNoTracking().ToListAsync();

            var projectRatings = projects.Select(p => new
            {
                idProject = p.idProject,
                idAccount = p.idAccount,
                ratingSum = p.Ratings.Count > 0 ? p.Ratings.Average(r => r.rating) : 0,
                commentSum = p.Ratings.Count(x => !string.IsNullOrEmpty(x.comment))
            }).ToList();

            var businessRatings = projectRatings.GroupBy(p => p.idAccount)
                .Select(g => new
                {
                    idAcount = g.Key,
                    totalRating = g.Average(p => p.ratingSum),
                    totalComment = g.Sum(p => p.commentSum)
                })
                .OrderByDescending(b => b.totalRating).Take(3).ToList();

            var top3Business = await Task.WhenAll(
                businessRatings.Select(async b => new ViewBusinessStatistic
                {
                    idAccount = b.idAcount,
                    fullName = (await GetInfoUser(b.idAcount)).fullName,
                    avatar = (await GetInfoUser(b.idAcount)).avatar,
                    ratingAvg = b.totalRating,
                    commentSum = b.totalComment
                })
            );
            return top3Business.ToList();
        }

        [HttpGet("GetTop3Freelancer")]
        public async Task<List<ViewFreelancerStatistic>> GetTop3Freelancer()
        {
            var projectMembers = await _context.ProjectMembers
                .Where(x => x.type == BusinessObjects.Enums.Project.Type.Invited && x.isAcept == true)
                .GroupBy(x => x.idAccount)
                .Select(x => new
                {
                    idAccount = x.Key,
                    inviteCount = x.Count()
                })
                .OrderByDescending(x => x.inviteCount)
                .Take(3)
                .ToListAsync();

            var top3Freelancers = await Task.WhenAll(
                projectMembers.Select(async x => new ViewFreelancerStatistic
                {
                    idAccount = x.idAccount,
                    fullName = (await GetInfoUser(x.idAccount)).fullName,
                    avatar = (await GetInfoUser(x.idAccount)).avatar,
                    inviteCount = x.inviteCount
                })
            );
            return top3Freelancers.ToList();
        }

        [HttpGet("GetTop3Project")]
        public async Task<List<ViewProjectStatistic>> GetTop3Project()
        {
            var projects = await _context.Projects.Include(x => x.Ratings).AsNoTracking().ToListAsync();

            var top3Project = await Task.WhenAll(projects.OrderByDescending(x => x.Ratings.Count > 0 ? x.Ratings.Average(r => r.rating) : 0)
                .Take(3).Select(async x => new ViewProjectStatistic
                {
                    idProject = x.idProject,
                    nameProject = x.name,
                    avatarProject = x.avatar,
                    idAccount = x.idAccount,
                    fullname = (await GetInfoUser(x.idAccount)).fullName,
                    avatar = (await GetInfoUser(x.idAccount)).avatar,
                    ratingAvg = x.Ratings.Count > 0 ? x.Ratings.Average(r => r.rating) : 0,
                    commentSum = x.Ratings.Count(x => !string.IsNullOrEmpty(x.comment))
                })
            );
            return top3Project.ToList();
        }

        [HttpGet("GetAllProcessProjectInSystem")]
        public async Task<List<ViewAccountStatistic>> GetAllProcessProjectInSystem()
        {
            var projectPreparing = await _context.Projects.CountAsync(x => x.process == Process.Preparing);
            var projectProcessing = await _context.Projects.CountAsync(x => x.process == Process.Processing);
            var projectPending = await _context.Projects.CountAsync(x => x.process == Process.Pending);
            var projectDone = await _context.Projects.CountAsync(x => x.process == Process.Done);

            return new List<ViewAccountStatistic>
            {
                new ViewAccountStatistic { type = "Project is preparing", count = projectPreparing },
                new ViewAccountStatistic { type = "Project is processing", count = projectProcessing },
                new ViewAccountStatistic { type = "Project is pending", count = projectPending },
                new ViewAccountStatistic { type = "Project is done", count = projectDone },
            };
        }

        [HttpGet("GetProjectStatistic/{statisticType}")]
        public async Task<List<ViewStatistic>> GetProjectStatistic(string statisticType)
        {
            var startDate = DateTime.Now.ToString("yyyy-MM-dd");

            var startOfWeek = DateTime.Parse(startDate).AddDays(-(int)DateTime.Parse(startDate).DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(7);
            var startOfMonth = new DateTime(DateTime.Parse(startDate).Year, DateTime.Parse(startDate).Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            var startOfYear = new DateTime(DateTime.Parse(startDate).Year, 1, 1);
            var endOfYear = startOfYear.AddYears(1);
            var projectStatistic = new List<ViewStatistic>();
            if (statisticType == "today")
            {
                var projects = await _context.Projects
                .Where(x => x.createdDate >= DateTime.Parse(startDate) && x.createdDate < DateTime.Parse(startDate).AddDays(1))
                .ToListAsync();

                for (int hour = 0; hour < 24; hour++)
                {
                    var count = projects.Count(x => x.createdDate.Hour == hour);
                    projectStatistic.Add(new ViewStatistic
                    {
                        hourInDay = hour,
                        count = count
                    });
                }

                return projectStatistic;
            }
            else if (statisticType == "week")
            {
                var projects = await _context.Projects
                .Where(x => x.createdDate >= startOfWeek && x.createdDate < endOfWeek)
                .ToListAsync();

                for (int day = 0; day < 7; day++)
                {
                    var dayOfWeek = (DayOfWeek)day;
                    var count = projects.Count(x => x.createdDate.DayOfWeek == dayOfWeek);
                    projectStatistic.Add(new ViewStatistic
                    {
                        dayInWeek = dayOfWeek.ToString(),
                        count = count
                    });
                }

                return projectStatistic;
            }
            else if (statisticType == "month")
            {
                var projects = await _context.Projects
                .Where(x => x.createdDate >= startOfMonth && x.createdDate < endOfMonth)
                .ToListAsync();

                var daysInMonth = (endOfMonth - startOfMonth).Days;
                for (int day = 0; day < daysInMonth; day++)
                {
                    var date = startOfMonth.AddDays(day);
                    var count = projects.Count(x => x.createdDate.Date == date.Date);
                    projectStatistic.Add(new ViewStatistic
                    {
                        dayInMonth = date.Date,
                        count = count
                    });
                }

                return projectStatistic;
            }
            else if (statisticType == "year")
            {
                var projects = await _context.Projects
                .Where(x => x.createdDate >= startOfYear && x.createdDate < endOfYear)
                .ToListAsync();

                for (int month = 1; month <= 12; month++)
                {
                    var monthName = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);
                    var count = projects.Count(x => x.createdDate.Month == month);
                    projectStatistic.Add(new ViewStatistic
                    {
                        monthInYear = monthName,
                        count = count
                    });
                }

                return projectStatistic;
            }
            return null;
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
                project.isVerified = infoUser.isVerified;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
                var ratings = await _context.Ratings.Where(x => x.idProject == project.idProject).Select(x => x.rating).ToListAsync();
                project.ratingNum = ratings.Count;
                if (ratings.Count > 0)
                {
                    project.ratingAvg = ratings.Average();
                }
                else
                {
                    project.ratingAvg = 0;
                }
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
                project.isVerified = infoUser.isVerified;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
                var ratings = await _context.Ratings.Where(x => x.idProject == project.idProject).Select(x => x.rating).ToListAsync();
                project.ratingNum = ratings.Count;
                if (ratings.Count > 0)
                {
                    project.ratingAvg = ratings.Average();
                }
                else
                {
                    project.ratingAvg = 0;
                }
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
                    projectMember.isVerified = inforUser.isVerified;
                    projectMember.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                    projectMember.name = project.name;
                    projectMember.process = project.process;
                    var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                    var viewPosition = _mapper.Map<List<PositionView>>(positions);
                    projectMember.PositionViews = viewPosition;
                    var ratings = await _context.Ratings.Where(x => x.idProject == project.idProject).Select(x => x.rating).ToListAsync();
                    projectMember.ratingNum = ratings.Count;
                    if (ratings.Count > 0)
                    {
                        projectMember.ratingAvg = ratings.Average();
                    }
                    else
                    {
                        projectMember.ratingAvg = 0;
                    }
                    var projectMemberInProject = await _context.ProjectMembers.Where(x => x.idProject == projectMember.idProject && x.isAcept == true).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                    var viewMember = _mapper.Map<List<MemberView>>(projectMemberInProject);
                    foreach (var item in viewMember)
                    {
                        var infoUserMember = await GetInfoUser(item.idAccount);
                        item.avatarMember = infoUserMember.avatar;
                    }
                    projectMember.MemberViews = viewMember;
                    projectMember.numberMember = projectMemberInProject.Count();
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
                project.isVerified = infoUser.isVerified;
                project.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, project.avatar);
                var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
                var viewPosition = _mapper.Map<List<PositionView>>(positions);
                project.PositionViews = viewPosition;
                var ratings = await _context.Ratings.Where(x => x.idProject == project.idProject).Select(x => x.rating).ToListAsync();
                project.ratingNum = ratings.Count;
                if (ratings.Count > 0)
                {
                    project.ratingAvg = ratings.Average();
                }
                else
                {
                    project.ratingAvg = 0;
                }
                var projectMemberInProject = await _context.ProjectMembers.Where(x => x.idProject == project.idProject && x.isAcept == true).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                var viewMember = _mapper.Map<List<MemberView>>(projectMemberInProject);
                foreach (var item in viewMember)
                {
                    var infoUserMember = await GetInfoUser(item.idAccount);
                    item.avatarMember = infoUserMember.avatar;
                }
                project.MemberViews = viewMember;
                project.numberMember = projectMemberInProject.Count();
            }
            return new Response(HttpStatusCode.OK, "Get project list is success!", result);
        }

        [HttpGet("GetProjectById/{idUser}/{idProject}")]
        public async Task<Response> GetProjectById(string idUser, Guid idProject)
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
            result.isVerified = infoUser.isVerified;
            result.avatarSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
            var positions = await _context.Positions.Where(x => x.idProject == project.idProject).ToListAsync();
            var viewPosition = _mapper.Map<List<PositionView>>(positions);
            result.PositionViews = viewPosition;
            var ratings = await _context.Ratings.Where(x => x.idProject == idProject).Select(x => x.rating).ToListAsync();
            result.ratingNum = ratings.Count;
            if (ratings.Count > 0)
            {
                result.ratingAvg = ratings.Average();
            }
            else
            {
                result.ratingAvg = 0;
            }
            var isRating = await _context.Ratings.FirstOrDefaultAsync(x => x.idRater == idUser && x.idProject == result.idProject);
            if (isRating != null)
            {
                result.isRating = true;
            }
            return new Response(HttpStatusCode.OK, "Get project is success!", result);
        }

        [HttpGet("GetAllMemberInProject/{idUser}/{idProject}")]
        public async Task<Response> GetAllMemberInProject(string idUser, Guid idProject)
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
                    member.isVerified = infoUser.isVerified;
                    var postion = await _context.Positions.FirstOrDefaultAsync(x => x.idPosition == member.idPosition);
                    member.namePosition = postion.namePosition;
                    var ratings = await _context.Ratings.Where(x => x.idRated == member.idAccount && x.idProjectMember == member.idProjectMember).Select(x => x.rating).ToListAsync();
                    member.ratingNum = ratings.Count();
                    if (ratings.Count > 0)
                    {
                        member.ratingAvg = ratings.Average();
                    }
                    else
                    {
                        member.ratingAvg = 0;
                    }
                    var isRating = await _context.Ratings.FirstOrDefaultAsync(x => x.idRater == idUser && x.idProjectMember == member.idProjectMember);

                    if (isRating != null || member.idAccount == idUser)
                    {
                        member.isRating = true;
                    }
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
            var project = _mapper.Map<Project>(projectInfoCreate);
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
                    var existPosition = await _context.Positions.Where(x => x.idProject == project.idProject).AsNoTracking().ToListAsync();

                    var positionRemove = existPosition.Where(x => !projectInfoUpdate.namePosition.Contains(x.namePosition)).ToList();
                    _context.Positions.RemoveRange(positionRemove);

                    foreach (var position in projectInfoUpdate.namePosition)
                    {
                        if (!existPosition.Any(p => p.namePosition == position))
                        {
                            Position newPosition = new Position()
                            {
                                idProject = project.idProject,
                                namePosition = position
                            };
                            await _context.Positions.AddAsync(newPosition);
                        }
                    }
                    await _context.SaveChangesAsync();
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
                            projectApplication.isVerified = infoUser.isVerified;
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
                            sendInvite.isVerified = infoUser.isVerified;
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
                    projectInvite.isVerified = infoUser.isVerified;
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
                    projectApplication.isVerified = infoUser.isVerified;
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
            var member = await _context.ProjectMembers.Include(x => x.Ratings).FirstOrDefaultAsync(x => x.idProjectMember == idProjectMember && x.isAcept == true);
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

        /*------------------------------------------------------------Rating------------------------------------------------------------*/

        [HttpGet("GetAllRatingStarPeopleInProject/{idUser}/{idProject}")]
        public async Task<RatingStart> GetAllRatingStarPeopleInProject(string idUser, Guid idProject)
        {
            var project = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProject == idProject && x.idAccount == idUser);
            var ratings = await _context.Ratings.Where(x => x.idRated == idUser && x.idProjectMember == project.idProjectMember).Select(x => x.rating).ToListAsync();

            var totalRatings = ratings.Count();
            var averageRating = totalRatings > 0 ? ratings.Average() : 0;

            var rating5 = ratings.Count(r => r == 5);
            var rating4 = ratings.Count(r => r == 4);
            var rating3 = ratings.Count(r => r == 3);
            var rating2 = ratings.Count(r => r == 2);
            var rating1 = ratings.Count(r => r == 1);

            return new RatingStart
            {
                ratingAvg = averageRating,
                ratingNum = totalRatings,
                rating5 = totalRatings > 0 ? (double)rating5 / totalRatings * 100 : 0,
                rating4 = totalRatings > 0 ? (double)rating4 / totalRatings * 100 : 0,
                rating3 = totalRatings > 0 ? (double)rating3 / totalRatings * 100 : 0,
                rating2 = totalRatings > 0 ? (double)rating2 / totalRatings * 100 : 0,
                rating1 = totalRatings > 0 ? (double)rating1 / totalRatings * 100 : 0
            };
        }

        [HttpGet("GetAllRatingPeopleInProject/{idUser}/{idProject}")]
        public async Task<Response> GetAllRatingPeopleInProject(string idUser, Guid idProject)
        {
            var project = await _context.ProjectMembers.FirstOrDefaultAsync(x => x.idProject == idProject && x.idAccount == idUser);
            var ratings = await _context.Ratings.Where(x => x.idRated == idUser && x.idProjectMember == project.idProjectMember).AsNoTracking().ToListAsync();
            if (ratings.Count > 0)
            {
                var result = _mapper.Map<List<RatingViewProject>>(ratings);
                foreach (var rating in result)
                {
                    var infoUser = await GetInfoUser(rating.idRater);
                    rating.email = infoUser.email;
                    rating.fullName = infoUser.fullName;
                    rating.avatar = infoUser.avatar;
                    rating.isVerified = infoUser.isVerified;
                }
                return new Response(HttpStatusCode.OK, "Get all rating people in project is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all rating people in project is empty!");
        }

        [HttpGet("GetAllRatingStarBusiness/{idUser}")]
        public async Task<RatingStart> GetAllRatingStarBusiness(string idUser)
        {
            var projects = await _context.Projects.Include(x => x.Ratings).Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            var projectRatings = projects.Where(x => x.Ratings != null).SelectMany(x => x.Ratings.Select(x => x.rating));
            
            var totalRatings = projectRatings.Count();
            var averageRating = totalRatings > 0 ? projectRatings.Average() : 0;

            var rating5 = projectRatings.Count(r => r == 5);
            var rating4 = projectRatings.Count(r => r == 4);
            var rating3 = projectRatings.Count(r => r == 3);
            var rating2 = projectRatings.Count(r => r == 2);
            var rating1 = projectRatings.Count(r => r == 1);

            return new RatingStart
            {
                ratingAvg = averageRating,
                ratingNum = totalRatings,
                rating5 = totalRatings > 0 ? (double)rating5 / totalRatings * 100 : 0,
                rating4 = totalRatings > 0 ? (double)rating4 / totalRatings * 100 : 0,
                rating3 = totalRatings > 0 ? (double)rating3 / totalRatings * 100 : 0,
                rating2 = totalRatings > 0 ? (double)rating2 / totalRatings * 100 : 0,
                rating1 = totalRatings > 0 ? (double)rating1 / totalRatings * 100 : 0
            };
        }

        [HttpGet("GetAllRatingBusiness/{idUser}")]
        public async Task<Response> GetAllRatingBusiness(string idUser)
        {
            var projects = await _context.Projects.Include(x => x.Ratings).Where(x => x.idAccount == idUser).AsNoTracking().ToListAsync();
            if (projects.Count > 0)
            {
                List<RatingViewProject> ratingProjects = new List<RatingViewProject>();
                foreach (var project in projects)
                {
                    var ratings = await _context.Ratings.Where(x => x.idProject == project.idProject).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
                    if (ratings.Count > 0)
                    {
                        var result = _mapper.Map<List<RatingViewProject>>(ratings);
                        foreach (var rating in result)
                        {
                            var infoUser = await GetInfoUser(rating.idRater);
                            rating.email = infoUser.email;
                            rating.fullName = infoUser.fullName;
                            rating.avatar = infoUser.avatar;
                            rating.isVerified = infoUser.isVerified;
                            rating.projectName = project.name;
                        }
                        ratingProjects.AddRange(result);
                    }
                }
                if (ratingProjects.Count > 0)
                {
                    return new Response(HttpStatusCode.OK, "Get all rating project is success!", ratingProjects);
                }
                return new Response(HttpStatusCode.OK, "Get all rating business is empty!");
            }
            return new Response(HttpStatusCode.NoContent, "Get all project is empty!");
        }

        [HttpGet("GetAllRatingStarProject/{idProject}")]
        public async Task<RatingStart> GetAllRatingStarProject(Guid idProject)
        {
            var ratings = await _context.Ratings.Where(x => x.idProject == idProject).Select(x => x.rating).ToListAsync();

            var totalRatings = ratings.Count;
            var averageRating = totalRatings > 0 ? ratings.Average() : 0;

            var rating5 = ratings.Count(r => r == 5);
            var rating4 = ratings.Count(r => r == 4);
            var rating3 = ratings.Count(r => r == 3);
            var rating2 = ratings.Count(r => r == 2);
            var rating1 = ratings.Count(r => r == 1);

            return new RatingStart
            {
                ratingAvg = averageRating,
                ratingNum = totalRatings,
                rating5 = totalRatings > 0 ? (double)rating5 / totalRatings * 100 : 0,
                rating4 = totalRatings > 0 ? (double)rating4 / totalRatings * 100 : 0,
                rating3 = totalRatings > 0 ? (double)rating3 / totalRatings * 100 : 0,
                rating2 = totalRatings > 0 ? (double)rating2 / totalRatings * 100 : 0,
                rating1 = totalRatings > 0 ? (double)rating1 / totalRatings * 100 : 0
            };
        }

        [HttpGet("GetAllRatingProject/{idProject}")]
        public async Task<Response> GetAllRatingProject(Guid idProject)
        {
            var ratings = await _context.Ratings.Where(x => x.idProject == idProject).AsNoTracking().ToListAsync();
            if (ratings.Count > 0)
            {
                var result = _mapper.Map<List<RatingViewProject>>(ratings);
                foreach (var rating in result)
                {
                    var infoUser = await GetInfoUser(rating.idRater);
                    rating.email = infoUser.email;
                    rating.fullName = infoUser.fullName;
                    rating.avatar = infoUser.avatar;
                    rating.isVerified = infoUser.isVerified;
                }
                return new Response(HttpStatusCode.OK, "Get all rating project is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all rating project is empty!");
        }

        [HttpGet("GetAllRatingStarPeople/{idUser}")]
        public RatingStart GetAllRatingStarPeople(string idUser)
        {
            var ratings = _context.Ratings.Where(x => x.idRated == idUser).Select(x => x.rating).ToList();

            var totalRatings = ratings.Count;
            var averageRating = totalRatings > 0 ? ratings.Average() : 0;

            var rating5 = ratings.Count(r => r == 5);
            var rating4 = ratings.Count(r => r == 4);
            var rating3 = ratings.Count(r => r == 3);
            var rating2 = ratings.Count(r => r == 2);
            var rating1 = ratings.Count(r => r == 1);

            return new RatingStart
            {
                ratingAvg = averageRating,
                ratingNum = totalRatings,
                rating5 = totalRatings > 0 ? (double)rating5 / totalRatings * 100 : 0,
                rating4 = totalRatings > 0 ? (double)rating4 / totalRatings * 100 : 0,
                rating3 = totalRatings > 0 ? (double)rating3 / totalRatings * 100 : 0,
                rating2 = totalRatings > 0 ? (double)rating2 / totalRatings * 100 : 0,
                rating1 = totalRatings > 0 ? (double)rating1 / totalRatings * 100 : 0
            };
        }

        [HttpGet("GetAllRatingPeople/{idRated}")]
        public async Task<Response> GetAllRatingPeople(string idRated)
        {
            var ratings = await _context.Ratings.Where(x => x.idRated == idRated).AsNoTracking().ToListAsync();
            if (ratings.Count > 0)
            {
                var result = _mapper.Map<List<RatingViewProject>>(ratings);
                foreach (var rating in result)
                {
                    var infoUser = await GetInfoUser(rating.idRater);
                    rating.email = infoUser.email;
                    rating.fullName = infoUser.fullName;
                    rating.avatar = infoUser.avatar;
                    rating.isVerified = infoUser.isVerified;
                }
                return new Response(HttpStatusCode.OK, "Get all rating people is success!", result);
            }
            return new Response(HttpStatusCode.NoContent, "Get all rating people is empty!");
        }

        [HttpPost("CreateRatingProject/{idRater}/{idProject}")]
        public async Task<Response> CreateRatingProject(string idRater, Guid idProject, RatingCreateUpdate ratingCreateUpdate)
        {
            Rating rating = new Rating
            {
                idRater = idRater,
                idProject = idProject,
                rating = ratingCreateUpdate.rating,
                comment = ratingCreateUpdate.comment,
                createdDate = DateTime.Now
            };
            await _context.Ratings.AddAsync(rating);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Create rating project is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Create rating project is fail!");
        }

        [HttpPost("CreateRatingPeople/{idRater}/{idRated}/{idProjectMember}")]
        public async Task<Response> CreateRatingPeople(string idRater, string idRated, Guid idProjectMember, RatingCreateUpdate ratingCreateUpdate)
        {
            Rating rating = new Rating
            {
                idRater = idRater,
                idRated = idRated,
                idProjectMember = idProjectMember,
                rating = ratingCreateUpdate.rating,
                comment = ratingCreateUpdate.comment,
                createdDate = DateTime.Now
            };
            await _context.Ratings.AddAsync(rating);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.OK, "Create rating people is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Create rating people is fail!");
        }

        [HttpPut("UpdateRating/{idRating}")]
        public async Task<Response> UpdateRating(Guid idRating, RatingCreateUpdate ratingCreateUpdate)
        {
            var ratingExist = await _context.Ratings.FindAsync(idRating);
            if (ratingExist == null)
            {
                return new Response(HttpStatusCode.NotFound, "Rating doesn't exists!");
            }
            _mapper.Map(ratingCreateUpdate, ratingExist);
            _context.Ratings.Update(ratingExist);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Update rating is success!");
            }
            return new Response(HttpStatusCode.NoContent, "Update rating is success!");
        }

        [HttpDelete("RemoveRating/{idRating}")]
        public async Task<Response> RemoveRating(Guid idRating)
        {
            var ratingExist = await _context.Ratings.FindAsync(idRating);
            if (ratingExist == null)
            {
                return new Response(HttpStatusCode.NotFound, "Rating doesn't exists!");
            }
            _context.Ratings.Remove(ratingExist);
            var isSuccess = await _context.SaveChangesAsync();
            if (isSuccess > 0)
            {
                return new Response(HttpStatusCode.NoContent, "Remove rating is success!");
            }
            return new Response(HttpStatusCode.BadRequest, "Remove rating is fail!");
        }
    }
}