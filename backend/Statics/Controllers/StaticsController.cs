using BusinessObjects.Enums.Project;
using BusinessObjects.ViewModels.Statistic;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Statics.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaticsController : ControllerBase
    {
        private readonly HttpClient client;

        public string BlogApiUrl { get; }
        public string PostApiUrl { get; }
        public string ProjectApiUrl { get; }
        public string UserApiUrl { get; }

        public StaticsController()
        {
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            BlogApiUrl = "https://localhost:7007/api/Blog";
            PostApiUrl = "https://localhost:7008/api/Post";
            ProjectApiUrl = "https://localhost:7005/api/ProjectInfo";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------StatisticBlog------------------------------------------------------------*/

        [HttpGet("CallBlogStatistic")]
        public async Task<Response> CallBlogStatistic(DateTime? startDate, DateTime? endDate)
        {
            var formattedStartDate = startDate?.ToString("yyyy-MM-dd");
            var formattedEndDate = endDate?.ToString("yyyy-MM-dd");
            HttpResponseMessage response;
            if (formattedStartDate != null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{BlogApiUrl}/GetBlogStatistic?startDate={formattedStartDate}&endDate={formattedEndDate}");
            }
            else if (formattedStartDate != null && formattedEndDate == null)
            {
                response = await client.GetAsync($"{BlogApiUrl}/GetBlogStatistic?startDate={formattedStartDate}");
            }
            else if (formattedStartDate == null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{BlogApiUrl}/GetBlogStatistic?endDate={formattedEndDate}");
            }
            else 
            {
                response = await client.GetAsync($"{BlogApiUrl}/GetBlogStatistic");
            }
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var blogStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (blogStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get blog statistic is success!", blogStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get blog statistic is empty!");
        }

        /*------------------------------------------------------------StatisticPost------------------------------------------------------------*/

        [HttpGet("CallPostStatistic")]
        public async Task<Response> CallPostStatistic(DateTime? startDate, DateTime? endDate)
        {
            var formattedStartDate = startDate?.ToString("yyyy-MM-dd");
            var formattedEndDate = endDate?.ToString("yyyy-MM-dd");
            HttpResponseMessage response;
            if (formattedStartDate != null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{PostApiUrl}/GetPostStatistic?startDate={formattedStartDate}&endDate={formattedEndDate}");
            }
            else if (formattedStartDate != null && formattedEndDate == null)
            {
                response = await client.GetAsync($"{PostApiUrl}/GetPostStatistic?startDate={formattedStartDate}");
            }
            else if (formattedStartDate == null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{PostApiUrl}/GetPostStatistic?endDate={formattedEndDate}");
            }
            else
            {
                response = await client.GetAsync($"{PostApiUrl}/GetPostStatistic");
            }
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var postStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (postStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get post statistic is success!", postStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get post statistic is empty!");
        }

        /*------------------------------------------------------------StatisticProject------------------------------------------------------------*/

        [HttpGet("CallProjectStatistic")]
        public async Task<Response> CallProjectStatistic(DateTime? startDate, DateTime? endDate)
        {
            var formattedStartDate = startDate?.ToString("yyyy-MM-dd");
            var formattedEndDate = endDate?.ToString("yyyy-MM-dd");
            HttpResponseMessage response;
            if (formattedStartDate != null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{ProjectApiUrl}/GetProjectStatistic?startDate={formattedStartDate}&endDate={formattedEndDate}");
            }
            else if (formattedStartDate != null && formattedEndDate == null)
            {
                response = await client.GetAsync($"{ProjectApiUrl}/GetProjectStatistic?startDate={formattedStartDate}");
            }
            else if (formattedStartDate == null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{ProjectApiUrl}/GetProjectStatistic?endDate={formattedEndDate}");
            }
            else
            {
                response = await client.GetAsync($"{ProjectApiUrl}/GetProjectStatistic");
            }
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var postStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (postStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get project statistic is success!", postStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get project statistic is empty!");
        }

        [HttpGet("GetTop1Freelancer")]
        public async Task<Response> GetTop1Freelancer()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTop1Freelancer");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var projectMemberStatistic = JsonSerializer.Deserialize<ViewFreelancerStatistic>(strData, option);
            if (projectMemberStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get top 1 freelancer is success!", projectMemberStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get top 1 freelancer is empty!");
        }

        [HttpGet("GetTop1Project")]
        public async Task<Response> GetTop1Project()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTop1Project");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var projectRatingStatistic = JsonSerializer.Deserialize<ViewProjectStatistic>(strData, option);
            if (projectRatingStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get top 1 project is success!", projectRatingStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get top 1 project is empty!");
        }

        /*------------------------------------------------------------StatisticUser------------------------------------------------------------*/

        [HttpGet("CallUserStatistic")]
        public async Task<Response> CallUserStatistic(DateTime? startDate, DateTime? endDate)
        {
            var formattedStartDate = startDate?.ToString("yyyy-MM-dd");
            var formattedEndDate = endDate?.ToString("yyyy-MM-dd");
            HttpResponseMessage response;
            if (formattedStartDate != null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{UserApiUrl}/GetUserStatistic?startDate={formattedStartDate}&endDate={formattedEndDate}");
            }
            else if (formattedStartDate != null && formattedEndDate == null)
            {
                response = await client.GetAsync($"{UserApiUrl}/GetUserStatistic?startDate={formattedStartDate}");
            }
            else if (formattedStartDate == null && formattedEndDate != null)
            {
                response = await client.GetAsync($"{UserApiUrl}/GetUserStatistic?endDate={formattedEndDate}");
            }
            else
            {
                response = await client.GetAsync($"{UserApiUrl}/GetUserStatistic");
            }
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var userStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (userStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get user statistic is success!", userStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get user statistic is empty!");
        }
    }
}
