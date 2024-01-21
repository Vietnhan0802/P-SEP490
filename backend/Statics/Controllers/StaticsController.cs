using BusinessObjects.Enums.Project;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Statics.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaticsController : ControllerBase
    {
        private readonly HttpClient client;

        public string ProjectInfoApiUrl { get; }
        public StaticsController()
        {
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            ProjectInfoApiUrl = "https://localhost:7005/api/ProjectInfo";
        }

        [HttpGet("GetTotalProjects")]
        public async Task<Response> GetTotalProjects()
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectInfoApiUrl}/GetTotalProjects");
            return await APIResponse(response);
        }

        [HttpGet("GetAllNewProjects/{interval}")]
        public async Task<Response> GetAllNewProjects(string interval)
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectInfoApiUrl}/GetAllNewProjects/{interval}");
            return await APIResponse(response);
        }

        [HttpGet("GetProjectsByProcess/{process}")]
        public async Task<Response> GetProjectsByProcess(Process process)
        {
            HttpResponseMessage response = await client.GetAsync($"{ProjectInfoApiUrl}/GetProjectsByProcess/{process}");
            return await APIResponse(response);
        }

        private async Task<Response> APIResponse(HttpResponseMessage response)
        {
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var result = JsonSerializer.Deserialize<Response>(strData, option);
            return result;
        }
    }
}
