using AutoMapper;
using BusinessObjects.Entities.Credential;
using BusinessObjects.ViewModels.Blog;
using BusinessObjects.ViewModels.Credential;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Credential.Data;
using Credential.Validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Credential.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DegreeController : ControllerBase
    {
        private readonly AppDBContext _context;
        private readonly IMapper _mapper;
        private readonly SaveImageService _saveImageService;
        /*private readonly HttpClient client;
        public string UserApiUrl { get; }*/

        public DegreeController(AppDBContext context, IMapper mapper, SaveImageService saveImageService)
        {
            _context = context;
            _mapper = mapper;
            _saveImageService = saveImageService;
            /*client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            UserApiUrl = "https://localhost:7006/api/User";*/
        }

        /*[HttpGet("GetNameUserCurrent/{idUser}")]
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
        }*/

        [HttpGet("GetAllDegree")]
        public async Task<Response> GetAllDegree()
        {
            var degrees = await _context.Degrees.ToListAsync();
            if (degrees == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            var result = _mapper.Map<List<ViewDegree>>(degrees);
            foreach (var degree in result)
            {
                degree.FileSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, degree.file);
            }
            return new Response(HttpStatusCode.OK, "Get all degree success!", result);
        }

        [HttpGet("GetDegreeByUser/{idUser}")]
        public async Task<Response> GetDegreeByUser(string idUser)
        {
            var degrees = await _context.Degrees.Where(x => x.idAccount == idUser).OrderByDescending(x => x.createdDate).AsNoTracking().ToListAsync();
            if (degrees == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            var result = _mapper.Map<List<ViewDegree>>(degrees);
            foreach (var degree in result)
            {
                degree.FileSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, degree.file);
            }
            return new Response(HttpStatusCode.OK, "Get degree by user success!", result);
        }

        [HttpGet("GetDegreeById/{idDegree}")]
        public async Task<Response> GetDegreeById(Guid idDegree)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            var result = _mapper.Map<ViewDegree>(degree);
            result.FileSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.file);
            return new Response(HttpStatusCode.OK, "Get degree by is success!", result);
        }

        [HttpPost("CreateDegree/{idUser}")]
        public async Task<Response> CreateDegree(string idUser, [FromForm] CreateUpdateDegree createUpdateDegree)
        {
            /*var validator = new CreateDegreeValidator();
            var validatorResult = validator.Validate(createUpdateDegree);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var file = await _saveImageService.SaveImage(createUpdateDegree.FileFile);
            var degree = _mapper.Map<Degree>(createUpdateDegree);
            degree.idAccount = idUser;
            degree.file = file;
            degree.createdDate = DateTime.Now;
            await _context.Degrees.AddAsync(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Create degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpPut("UpdateDegree/{idDegree}")]
        public async Task<Response> UpdateDegree(Guid idDegree, [FromForm] CreateUpdateDegree createUpdateDegree)
        {
            /*var validator = new UpdateDegreeValidator();
            var validatorResult = validator.Validate(createUpdateDegree);
            var error = validatorResult.Errors.Select(x => x.ErrorMessage).ToList();
            if (!validatorResult.IsValid)
            {
                return new Response(HttpStatusCode.BadRequest, "Invalid data", error);
            }*/
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            if (createUpdateDegree.FileFile != null)
            {
                _saveImageService.DeleteImage(degree.file);
                createUpdateDegree.file = await _saveImageService.SaveImage(createUpdateDegree.FileFile);
            }
            _mapper.Map(createUpdateDegree, degree);
            _context.Degrees.Update(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.OK, "Update degree is success!", _mapper.Map<ViewDegree>(degree));
        }

        [HttpDelete("RemoveDegree/{idDegree}")]
        public async Task<Response> RemoveDegree(Guid idDegree)
        {
            var degree = await _context.Degrees.FirstOrDefaultAsync(x => x.idDegree == idDegree);
            if (degree == null)
            {
                return new Response(HttpStatusCode.NotFound, "Degree doesn't exists!");
            }
            _context.Degrees.Remove(degree);
            await _context.SaveChangesAsync();
            return new Response(HttpStatusCode.NoContent, "Remove Degree successfullt!");
        }
    }
}
