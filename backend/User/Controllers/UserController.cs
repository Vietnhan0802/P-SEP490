using AutoMapper;
using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
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
        public async Task<Response> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null)
            {
                return new Response(HttpStatusCode.NoContent, "User list is empty!");
            }
            return new Response(HttpStatusCode.OK, "Get all users is success!", _mapper.Map<List<ViewUser>>(users));
        }

        [HttpGet("GetUserById/{idUser}")]
        public async Task<Response> GetUserById(string idUser)
        {
            var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
            }
            return new Response(HttpStatusCode.OK, "Get user is success!", _mapper.Map<ViewUser>(user));
        }

        [HttpGet("GetNameUser/{idUser}")]
        public async Task<ActionResult<ViewUser>> GetNameUser(string idUser)
        {
            var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                return NotFound("User doesn't exist!");
            }
            string fullName = user.fullName;
            return Ok(fullName);
        }

        [HttpGet("BlockUser/{idUser}")]
        public async Task<Response> BlockUser (string idUser)
        {
            var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
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
                return new Response(HttpStatusCode.NoContent, "User has been updated!");
            }
            else
            {
                return new Response(HttpStatusCode.BadRequest, "User hasn't been updated!");
            }
        }

        [HttpPut("UpdateUser/{idUser}")]
        public async Task<Response> UpdateUser(string idUser, UpdateUser updateUser)
        {
            var userExits = await _userManager.FindByIdAsync(idUser);
            if (userExits == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
            }
            //updateUser.avatar = await SaveImage(updateUser.imageFile);
            var user = _mapper.Map(updateUser, userExits);
            await _userManager.UpdateAsync(user);
            return new Response(HttpStatusCode.OK, "Update user is success!", _mapper.Map<UpdateUser>(userExits));
        }

        [HttpPost("SignUpMember")]
        public async Task<Response> SignUpMember(SignUpPerson signUpForPerson)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForPerson.email);
            if (userExits != null)
            {
                return new Response(HttpStatusCode.Conflict, "User already exists!");
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForPerson.email,
                Email = signUpForPerson.email,
                fullName = signUpForPerson.fullName,
                date = signUpForPerson.birthday,
                isMale = signUpForPerson.isMale,
                PhoneNumber = signUpForPerson.phone,
                tax = signUpForPerson.tax,
                address = signUpForPerson.address,
                isBlock = false,
                createdDate = DateTime.Now,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, signUpForPerson.password);
            if (!result.Succeeded)
            {
                return new Response(HttpStatusCode.BadRequest, "User failed to create! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Member.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Member.ToString());

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmLink = Url.Action(nameof(ConfirmEmail), "User", new { token, email = user.Email }, Request.Scheme);
                EmailRequest emailRequest = new EmailRequest();
                emailRequest.ToEmail = user.Email;
                emailRequest.Subject = "Confirmation Email";
                emailRequest.Body = GetHtmlContent(user.fullName, confirmLink!);
                await _emailService.SendEmailAsync(emailRequest);
                return new Response(HttpStatusCode.NoContent, "User creates & sends email successfully!");
            }
            return new Response(HttpStatusCode.BadRequest, "User failed to create!");
        }

        [HttpPost("SignUpBusiness")]
        public async Task<Response> SignUpBusiness(SignUpBusiness signUpForBusiness)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForBusiness.email);
            if (userExits != null)
            {
                return new Response(HttpStatusCode.Conflict, "User already exists!");
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForBusiness.email,
                Email = signUpForBusiness.email,
                fullName = signUpForBusiness.fullName,
                date = signUpForBusiness.establishment,
                PhoneNumber = signUpForBusiness.phone,
                tax = signUpForBusiness.tax,
                address = signUpForBusiness.address,
                isBlock = false,
                createdDate = DateTime.Now,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, signUpForBusiness.password);
            if (!result.Succeeded)
            {
                return new Response(HttpStatusCode.BadRequest, "User failed to create! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Business.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Business.ToString());

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmLink = Url.Action(nameof(ConfirmEmail), "User", new { token, email = user.Email }, Request.Scheme);
                EmailRequest emailRequest = new EmailRequest();
                emailRequest.ToEmail = user.Email;
                emailRequest.Subject = "Confirmation Email";
                emailRequest.Body = GetHtmlContent(user.fullName, confirmLink!);
                await _emailService.SendEmailAsync(emailRequest);
                return new Response(HttpStatusCode.NoContent, "User creates & sends email successfully!");
            }
            return new Response(HttpStatusCode.BadRequest, "User failed to create!");
        }

        [HttpPost("SignIn")]
        public async Task<Response> SignIn(SignIn signIn)
        {
            var user = await _userManager.FindByEmailAsync(signIn.email);
            if (user.isBlock == true)
            {
                return new Response(HttpStatusCode.Unauthorized, "User has been blocked!");
            }
            if (user != null && await _userManager.CheckPasswordAsync(user, signIn.password))
            {
                if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    return new Response(HttpStatusCode.Unauthorized, "Please confirm your email before logging in!");
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
                    new Claim("Date", user.date.ToString()),
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
                var result = new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                    role = string.Join(",", userRoles)
                };
                return new Response(HttpStatusCode.OK, "Login successfully", result);
            }
            return new Response(HttpStatusCode.BadRequest, "Invalid input attempt!");
        }

        [HttpPost("ChangePassword/{email}")]
        public async Task<Response> ChangePassword(string email, ChangePassword changePassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
            }
            var change = await _userManager.ChangePasswordAsync(user, changePassword.Password, changePassword.NewPassword);
            if (!change.Succeeded)
            {
                return new Response(HttpStatusCode.BadRequest, "User change password fail!");
            }
            /*await _signInManager.RefreshSignInAsync(user);*/
            return new Response(HttpStatusCode.NoContent, "User change password successfully!");
        }

        [HttpPost("ForgotPassword")]
        public async Task<Response> ForgotPasswordUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var link = Url.Action(nameof(ResetPassword), "User", new { token, email = user.Email }, Request.Scheme);
                EmailRequest emailRequest = new EmailRequest();
                emailRequest.ToEmail = user.Email;
                emailRequest.Subject = "Change Password";
                emailRequest.Body = GetHtmlContent(user.fullName, link!);
                await _emailService.SendEmailAsync(emailRequest);
                return new Response(HttpStatusCode.NoContent, "User send request change password to email successfully!");
            }
            return new Response(HttpStatusCode.BadRequest, "Couldn't send link to email!");
        }

        [HttpPost("ResetPassword")]
        public async Task<Response> ResetPassword(ResetPassword resetPassword)
        {
            var user = await _userManager.FindByEmailAsync(resetPassword.Email);
            if (user != null)
            {
                var reset = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
                if (!reset.Succeeded)
                {
                    foreach (var error in reset.Errors)
                    {
                        ModelState.AddModelError(error.Code, error.Description);
                    }
                    return new Response(HttpStatusCode.OK, "", ModelState);
                }
                return new Response(HttpStatusCode.NoContent, "Password has been changed!");
            }
            return new Response(HttpStatusCode.BadRequest, "Undefined error!");
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

        [HttpGet("ConfirmEmail")]
        public async Task<Response> ConfirmEmail(string token, string email)
        {
            var userExits = await _userManager.FindByEmailAsync(email);
            if (userExits != null)
            {
                var result = await _userManager.ConfirmEmailAsync(userExits, token);
                if (result.Succeeded)
                {
                    return new Response(HttpStatusCode.NoContent, "Email verified successfully!");
                }
            }
            return new Response(HttpStatusCode.BadRequest, "User doesn't exists!");
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

        [HttpGet("TokenResetPassword")]
        public async Task<Response> TokenResetPassword(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var model = new TokenResetPassword
                {
                    token = token
                };
                return new Response(HttpStatusCode.OK, "", model);
            }
            return new Response(HttpStatusCode.BadRequest, "Undefined error!");
        }

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