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
        public string InteractionApiUrl { get; }
        public string PostApiUrl { get; }
        public string ProjectApiUrl { get; }
        public string UserApiUrl { get; }

        public StaticsController()
        {
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            BlogApiUrl = "https://localhost:7007/api/Blog";
            InteractionApiUrl = "https://localhost:7004/api/Interaction";
            PostApiUrl = "https://localhost:7008/api/Post";
            ProjectApiUrl = "https://localhost:7005/api/ProjectInfo";
            UserApiUrl = "https://localhost:7006/api/User";
        }

        /*------------------------------------------------------------StatisticBlog------------------------------------------------------------*/

        [HttpGet("CallBlogStatistic/{statisticType}")]
        public async Task<Response> CallBlogStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{BlogApiUrl}/GetBlogStatistic/{statisticType}");
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

        /*------------------------------------------------------------StatisticInteraction------------------------------------------------------------*/

        [HttpGet("CallVerificationStatistic/{statisticType}")]
        public async Task<Response> CallVerificationStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{InteractionApiUrl}/GetVerificationStatistic/{statisticType}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var verificationStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (verificationStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get verification statistic is success!", verificationStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get verification statistic is empty!");
        }

        [HttpGet("CallReportStatistic/{statisticType}")]
        public async Task<Response> CallReportStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{InteractionApiUrl}/GetReportStatistic/{statisticType}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var reportStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (reportStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get report statistic is success!", reportStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get report statistic is empty!");
        }

        [HttpGet("GetAllStatusVerificationInSystem")]
        public async Task<Response> GetAllStatusVerificationInSystem()
        {
            HttpResponseMessage response = await client.GetAsync($"{InteractionApiUrl}/GetAllStatusVerificationInSystem");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var verificationStatistic = JsonSerializer.Deserialize<List<ViewAccountStatistic>>(strData, option);
            if (verificationStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get number status verification in system is success!", verificationStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get number status verification in system is empty!");
        }

        [HttpGet("GetAllReportInSystem")]
        public async Task<Response> GetAllReportInSystem()
        {
            HttpResponseMessage response = await client.GetAsync($"{InteractionApiUrl}/GetAllReportInSystem");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var reportStatistic = JsonSerializer.Deserialize<List<ViewAccountStatistic>>(strData, option);
            if (reportStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get number status verification in system is success!", reportStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get number status verification in system is empty!");
        }

        /*------------------------------------------------------------StatisticPost------------------------------------------------------------*/

        [HttpGet("CallPostStatistic/{statisticType}")]
        public async Task<Response> CallPostStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{PostApiUrl}/GetPostStatistic/{statisticType}");
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

        [HttpGet("CallProjectStatistic/{statisticType}")]
        public async Task<Response> CallProjectStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetProjectStatistic/{statisticType}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var projectStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (projectStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get project statistic is success!", projectStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get project statistic is empty!");
        }

        [HttpGet("GetAllProcessProjectInSystem")]
        public async Task<Response> GetAllProcessProjectInSystem()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetAllProcessProjectInSystem");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var projectStatistic = JsonSerializer.Deserialize<List<ViewAccountStatistic>>(strData, option);
            if (projectStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get number process project in system is success!", projectStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get number process project in system is empty!");
        }

        [HttpGet("GetTop3Business")]
        public async Task<Response> GetTop3Business()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTop3Business");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var top3Business = JsonSerializer.Deserialize<List<ViewBusinessStatistic>>(strData, option);
            if (top3Business != null)
            {
                return new Response(HttpStatusCode.OK, "Get top 3 business is success!", top3Business);
            }
            return new Response(HttpStatusCode.NoContent, "Get top 3 business is empty!");
        }

        [HttpGet("GetTop3Freelancer")]
        public async Task<Response> GetTop3Freelancer()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTop3Freelancer");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var top3Freelancer = JsonSerializer.Deserialize<List<ViewFreelancerStatistic>>(strData, option);
            if (top3Freelancer != null)
            {
                return new Response(HttpStatusCode.OK, "Get top 3 freelancer is success!", top3Freelancer);
            }
            return new Response(HttpStatusCode.NoContent, "Get top 3 freelancer is empty!");
        }

        [HttpGet("GetTop3Project")]
        public async Task<Response> GetTop3Project()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectApiUrl}/GetTop3Project");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var top3project = JsonSerializer.Deserialize<List<ViewProjectStatistic>>(strData, option);
            if (top3project != null)
            {
                return new Response(HttpStatusCode.OK, "Get top 3 project is success!", top3project);
            }
            return new Response(HttpStatusCode.NoContent, "Get top 3 project is empty!");
        }

        /*------------------------------------------------------------StatisticUser------------------------------------------------------------*/

        [HttpGet("CallAccountStatistic/{statisticType}")]
        public async Task<Response> CallAccountStatistic(string statisticType)
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetAccountStatistic/{statisticType}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var accountStatistic = JsonSerializer.Deserialize<List<ViewStatistic>>(strData, option);
            if (accountStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get account statistic is success!", accountStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get account statistic is empty!");
        }

        [HttpGet("GetAllAccountInSystem")]
        public async Task<Response> GetAllAccountInSystem()
        {
            HttpResponseMessage response = await client.GetAsync($"{UserApiUrl}/GetAllAccountInSystem");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var accountStatistic = JsonSerializer.Deserialize<List<ViewAccountStatistic>>(strData, option);
            if (accountStatistic != null)
            {
                return new Response(HttpStatusCode.OK, "Get number account in system is success!", accountStatistic);
            }
            return new Response(HttpStatusCode.NoContent, "Get number account in system is empty!");
        }
    }
}
