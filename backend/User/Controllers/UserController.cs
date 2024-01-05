using AutoMapper;
using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using User.Services;

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager,IEmailService emailService, IMapper mapper, IConfiguration configuration, IWebHostEnvironment hostEnvironment)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _emailService = emailService;
            _mapper = mapper;
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<ViewUser>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null || users.Count < 0)
            {
                return NotFound("User is empty!");
            }
            return _mapper.Map<List<ViewUser>>(users);
        }

        [HttpGet("GetUserById/{userId}")]
        public async Task<ActionResult<ViewUser>> GetUserById(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User doesn't exists!");
            }
            return _mapper.Map<ViewUser>(user);
        }

        [HttpGet("BlockUser/{userId}")]
        public async Task<IActionResult> BlockUser (string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User doesn't exists!");
            }
            if (user.isBlock == false)
            {
                user.isBlock = true;
            }
            else
            {
                user.isBlock = false;
            }
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok("User had been blocked!");
            }
            else
            {
                return BadRequest("Unable to blocked!");
            }
        }

        [HttpPut("UpdateUser/{userId}")]
        public async Task<ActionResult<UpdateUser>> UpdateUser(string userId, UpdateUser updateUser)
        {
            var userExits = await _userManager.FindByIdAsync(userId);
            if (userExits == null)
            {
                return NotFound("User doesn't exists!");
            }
            updateUser.avatar = await SaveImage(updateUser.imageFile);
            var user = _mapper.Map(updateUser, userExits);
            await _userManager.UpdateAsync(user);
            return _mapper.Map<UpdateUser>(userExits);
        }

        [HttpPost("SignUpForPerson")]
        public async Task<IActionResult> SignUpForPerson(SignUpForPerson signUpForPerson)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForPerson.email);
            if (userExits != null)
            {
                return Conflict("User already exists!");
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForPerson.email,
                Email = signUpForPerson.email,
                fullName = signUpForPerson.fullName,
                birthday = signUpForPerson.birthday,
                isMale = signUpForPerson.isMale,
                PhoneNumber = signUpForPerson.phone,
                tax = signUpForPerson.tax,
                address = signUpForPerson.address,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, signUpForPerson.password);
            if (!result.Succeeded)
            {
                return BadRequest("User created fail! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Person.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Person.ToString());

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmLink = Url.Action(nameof(ConfirmEmail), "User", new { token, email = user.Email }, Request.Scheme);
                EmailRequest emailRequest = new EmailRequest();
                emailRequest.ToEmail = user.Email;
                emailRequest.Subject = "Confirmation Email";
                emailRequest.Body = GetHtmlContent(user.fullName, confirmLink!); /*$"This is link: {confirmLink}";*/ 
                await _emailService.SendEmailAsync(emailRequest);
                return Ok("User created & email sent to successfully!");
            }
            return BadRequest("User failed to create!");
        }

        [HttpPost("SignUpForBusiness")]
        public async Task<IActionResult> SignUpForBusiness(SignUpForBusiness signUpForBusiness)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForBusiness.email);
            if (userExits != null)
            {
                return Conflict("User already exists!");
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForBusiness.email,
                Email = signUpForBusiness.email,
                fullName = signUpForBusiness.fullName,
                birthday = signUpForBusiness.establishment,
                PhoneNumber = signUpForBusiness.phone,
                tax = signUpForBusiness.tax,
                address = signUpForBusiness.address,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, signUpForBusiness.password);
            if (!result.Succeeded)
            {
                return BadRequest("User created fail! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Business.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Business.ToString());
                return Ok("User created & email sent to successfully!");
            }
            return BadRequest("User failed to create!");
        }

        private string GetHtmlContent(string fullname, string url)
        {
            string response = "<div style = \"width:100%; background-color:lightblue; text-align:center; margin:10px\">";
            response += $"<h1> Welcome to {fullname}</h1>";
            response += "<img src = \"https://baocaosu.us/tin/bo-anh-nguc-tran-cho-con-bu-tuyet-dep-cua-ba-me-nha-trang-5.jpg\">";
            response += "<h2>Thanks for subscribing!</h2>";
            response += $"<a href = \"{url}\">Please confirm by click the link!</a>";
            response += "<div><h1> Contact us: vantoitran2002@gmail.com</h1></div>";
            response += "</div>";
            return response;
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var userExits = await _userManager.FindByEmailAsync(email);
            if (userExits != null)
            {
                var result = await _userManager.ConfirmEmailAsync(userExits, token);
                if (result.Succeeded)
                {
                    return Ok("Email verified successfully!");
                }
            }
            return BadRequest("User doesn't exists!");
        }

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(SignIn signIn)
        {
            var user = await _userManager.FindByEmailAsync(signIn.email);
            if (user.isBlock == true)
            {
                return Unauthorized("User had been blocked!");
            }
            if (user != null && await _userManager.CheckPasswordAsync(user, signIn.password))
            {
                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    return Unauthorized("Please confirm your email before logging in!");
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                    new Claim("Id" , user.Id.ToString()),
                    new Claim("Username", user.UserName),
                    new Claim("Email", user.Email),
                    new Claim("FullName", user.fullName),
                    new Claim("Birthday", user.birthday.ToString()),
                    new Claim("IsMale", user.isMale.ToString()),
                    new Claim("Phone", user.PhoneNumber),
                    new Claim("Tax", user.tax.ToString()),
                    new Claim("Address", user.address)
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var jwtToken = GetToken(authClaims);

                return Ok(new JwtSecurityTokenHandler().WriteToken(jwtToken));
            }
            return BadRequest("Invalid input attempt!");
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));
            return token;
        }

        [HttpGet]

        [HttpGet("SignInGoogle")]
        public async Task<IActionResult> SignInGoogle()
        {
            var properties = new AuthenticationProperties 
            {
                RedirectUri = Url.Action("HandleGoogleResponse"),
                /*Items =
                {
                    { "schema", "Google" },
                },*/
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            var claims = result.Principal.Identities.FirstOrDefault().Claims.Select(claim => new
            {
                claim.Issuer,
                claim.OriginalIssuer,
                claim.Type,
                claim.Value
            });
            return Ok(claims);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile formFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(formFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(formFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await formFile.CopyToAsync(fileStream);
            }
            return imageName;
        }
    }
}
