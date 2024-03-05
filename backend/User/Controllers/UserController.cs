using AutoMapper;
using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.Follow;
using BusinessObjects.ViewModels.User;
using Commons.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using User.Services;

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly SaveImageService _saveImageService;
        private readonly HttpClient client;

        public string FollowApiUrl { get; }

        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<AppUser> signInManager, IEmailService emailService, IMapper mapper, IConfiguration configuration, SaveImageService saveImageService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _mapper = mapper;
            _configuration = configuration;
            _saveImageService = saveImageService;
            client = new HttpClient();
            var contentType = new MediaTypeWithQualityHeaderValue("application/json");
            client.DefaultRequestHeaders.Accept.Add(contentType);
            FollowApiUrl = "https://localhost:7002/api/Follow";
        }

        [HttpGet("GetTotalFollowings/{idOwner}")]
        private async Task<int> GetTotalFollowings(string idOwner)
        {
            HttpResponseMessage response = await client.GetAsync($"{FollowApiUrl}/GetTotalFollowings/{idOwner}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var followings = JsonSerializer.Deserialize<int>(strData, option);

            return followings!;
        }

        [HttpGet("GetTotalFollowers/{idOwner}")]
        private async Task<int> GetTotalFollowers(string idOwner)
        {
            HttpResponseMessage response = await client.GetAsync($"{FollowApiUrl}/GetTotalFollowers/{idOwner}");
            string strData = await response.Content.ReadAsStringAsync();
            var option = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            var followers = JsonSerializer.Deserialize<int>(strData, option);

            return followers!;
        }

        [HttpGet("GetFollow/{idOwner}/{idAccount}")]
        private async Task<FollowingView> GetFollow(string idOwner, string idAccount)
        {
            HttpResponseMessage response = await client.GetAsync($"{FollowApiUrl}/GetFollow/{idOwner}/{idAccount}");
            if (response.IsSuccessStatusCode)
            {
                string strData = await response.Content.ReadAsStringAsync();
                var option = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                };
                var follow = JsonSerializer.Deserialize<FollowingView>(strData, option);

                return follow;
            }
            else
            {
                return null;
            }
        }

        /*------------------------------------------------------------User------------------------------------------------------------*/

        [HttpGet("GetTotalUsersRegister/{startDate}/{endDate}")]
        public async Task<Response> GetTotalUsersRegister(DateTime startDate, DateTime endDate)
        {
            var totalUsersRegister = await _userManager.Users.Where(x => x.createdDate >= startDate && x.createdDate <= endDate).CountAsync();
            return new Response(HttpStatusCode.OK, "Get total users register is success!", totalUsersRegister);
        }

        [HttpGet("GetTotalBlockedUsers/{startDate}/{endDate}")]
        public async Task<Response> GetTotalBlockedUsers(DateTime startDate, DateTime endDate)
        {
            var totalBlockedUsers = await _userManager.Users.Where(x => x.createdDate >= startDate && x.createdDate <= endDate).CountAsync(u => u.isBlock == true);
            return new Response(HttpStatusCode.OK, "Get total blocked users is success!", totalBlockedUsers);
        }

        [HttpGet("SearchUserByName/{nameUser}")]
        public async Task<Response> SearchUserByName(string nameUser)
        {
            var users = await _userManager.Users.Where(x => x.fullName!.Contains(nameUser)).ToListAsync();
            if (users == null)
            {
                return new Response(HttpStatusCode.NoContent, "No users found with the given name!");
            }
            var result = _mapper.Map<List<ViewUser>>(users);
            foreach (var user in result)
            {
                user.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.avatar);
                foreach (var role in users)
                {
                    var userRoles = await _userManager.GetRolesAsync(role);
                    user.role = userRoles.FirstOrDefault()!;
                }
            }
            return new Response(HttpStatusCode.OK, $"Found {users.Count} user(s) with the given name", result);
        }

        [HttpGet("GetAllUsers")]
        public async Task<Response> GetAllUsers()
        {
            var adminRole = await _userManager.GetUsersInRoleAsync("Admin");
            var adminId = adminRole.Select(x => x.Id).ToList();
            var users = await _userManager.Users.Where(x => !adminId.Contains(x.Id)).ToListAsync();
            if (users == null)
            {
                return new Response(HttpStatusCode.NoContent, "User list is empty!");
            }
            var result = _mapper.Map<List<ViewUser>>(users);
            foreach (var user in result)
            {
                user.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.avatar);
                foreach (var role in users)
                {
                    if (user.Id == role.Id)
                    {
                        var userRoles = await _userManager.GetRolesAsync(role);
                        user.role = userRoles.FirstOrDefault()!;
                    } 
                }
            }
            return new Response(HttpStatusCode.OK, "Get all users is success!", result);
        }

        [HttpGet("GetUserById/{idUser}")]
        public async Task<Response> GetUserById(string idUser, string? idAccount = null)
        {
            if (idUser == idAccount || idAccount == null)
            {
                var user = await _userManager.FindByIdAsync(idUser);
                if (user == null)
                {
                    return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
                }
                var result = _mapper.Map<ViewUser>(user);
                result.follower = await GetTotalFollowers(result.Id);
                result.following = await GetTotalFollowings(result.Id);
                result.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
                var userRoles = await _userManager.GetRolesAsync(user);
                result.role = userRoles.FirstOrDefault()!;
                return new Response(HttpStatusCode.OK, "Get user is success!", result);
            }
            else if (idUser != idAccount) {
                var user = await _userManager.FindByIdAsync(idAccount);
                if (user == null)
                {
                    return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
                }
                var result = _mapper.Map<ViewUser>(user);
                var isFollow = await GetFollow(idUser, result.Id);
                if (isFollow != null)
                {
                    result.isFollow = true;
                }
                result.follower = await GetTotalFollowers(result.Id);
                result.following = await GetTotalFollowings(result.Id);
                result.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
                var userRoles = await _userManager.GetRolesAsync(user);
                result.role = userRoles.FirstOrDefault()!;
                return new Response(HttpStatusCode.OK, "Get user is success!", result);
            }
            return new Response(HttpStatusCode.BadRequest, "Get user is fail!");

            /*var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
            }
            var result = _mapper.Map<ViewUser>(user);*/
            /*var isFollow = await GetFollow(result.Id, idAccount);
            if (isFollow != null)
            {
                result.isFollow = true;
            }
            result.follower = await GetTotalFollowers(result.Id);
            result.following = await GetTotalFollowings(result.Id);
            result.ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, result.avatar);
            var userRoles = await _userManager.GetRolesAsync(user);
            result.role = userRoles.FirstOrDefault()!;
            return new Response(HttpStatusCode.OK, "Get user is success!", result);*/
        }

        [HttpGet("GetNameUser/{idUser}")]
        public async Task<ActionResult<ViewUser>> GetNameUser(string idUser)
        {
            var user = await _userManager.FindByIdAsync(idUser);
            if (user == null)
            {
                return NotFound("User doesn't exist!");
            }
            var result = new
            {
                fullName = user.fullName!,
                avatar = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, user.avatar)
            };
            return Ok(result);
        }

        [HttpPut("BlockUser/{idUser}")]
        public async Task<Response> BlockUser(string idUser)
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
            _mapper.Map(updateUser, userExits);
            await _userManager.UpdateAsync(userExits);
            return new Response(HttpStatusCode.OK, "Update user is success!", _mapper.Map<UpdateUser>(userExits));
        }

        [HttpPut("UpdateAvatar/{idUser}")]
        public async Task<Response> UpdateAvatar(string idUser, [FromForm] UpdateAvatar updateAvatar)
        {
            var userExits = await _userManager.FindByIdAsync(idUser);
            if (userExits == null)
            {
                return new Response(HttpStatusCode.NotFound, "User doesn't exist!");
            }
            if (userExits.avatar != null)
            {
                _saveImageService.DeleteImage(userExits.avatar);
            }
            if (updateAvatar.ImageFile != null)
            {
                var result = _mapper.Map(updateAvatar, userExits);
                result.avatar = await _saveImageService.SaveImage(result.ImageFile);
            }          
            await _userManager.UpdateAsync(userExits);
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
            if (user != null && await _userManager.CheckPasswordAsync(user, signIn.password))
            {
                if (user.isBlock == true)
                {
                    return new Response(HttpStatusCode.Unauthorized, "User has been blocked!");
                }
                /*if (!await _userManager.IsEmailConfirmedAsync(user))
                {
                    return new Response(HttpStatusCode.Unauthorized, "Please confirm your email before logging in!");
                }*/

                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim("Id" , user.Id.ToString()),
                    new Claim("Username", user.UserName),
                    new Claim("Email", user.Email),
                    new Claim("FullName", user.fullName),
                    new Claim("Date", user.date.ToString()),
                    new Claim("IsMale", user.isMale.ToString()),
                    new Claim("Phone", user.PhoneNumber),
                    new Claim("Tax", user.tax),
                    new Claim("Address", user.address),
                };
                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var jwtToken = GetToken(authClaims);
                var result = new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                    role = userRoles.FirstOrDefault()
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

        [HttpPost("ForgotPassword/{email}")]
        public async Task<Response> ForgotPasswordUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var link = Url.Action(nameof(TokenResetPassword), "User", new { token, email = user.Email }, Request.Scheme);
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
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var userExits = await _userManager.FindByEmailAsync(email);
            if (userExits != null)
            {
                var result = await _userManager.ConfirmEmailAsync(userExits, token);
                if (result.Succeeded)
                {
                    string redirectUrl = "http://localhost:3000/confirmemail";
                    return Redirect(redirectUrl);
                }
            }
            return BadRequest("User doesn't exists!");
        }

        private string GetHtmlContent(string fullname, string url)
        {
            string response = "<div style = \"width:100%; background-color:lightblue; text-align:center; margin:10px\">";
            response += $"<h1> Welcome to {fullname}</h1>";
            response += "<img src = \"https://inkythuatso.com/uploads/thumbnails/800/2023/01/1-meme-meo-cam-sung-sieu-ba-dao-17-15-34-21.jpg\">";
            response += "<h2>Thanks for subscribing!</h2>";
            response += $"<a href = \"{url}\">Please confirm by click the link!</a>";
            response += "<div><h1> Contact us: vantoitran2002@gmail.com</h1></div>";
            response += "</div>";
            return response;
        }

        [HttpGet("TokenResetPassword")]
        public async Task<IActionResult> TokenResetPassword(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                string tokenNew = Uri.EscapeDataString(token);
                string redirectUrl = $"http://localhost:3000/resetpassword?token={tokenNew}&email={email}";
                return Redirect(redirectUrl);
            }
            return BadRequest("User doesn't exists!");
        }

        [HttpGet("GoogleSignIn")]
        public IActionResult GoogleSignIn()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse"),
                Items =
                {
                    { "scheme", "Google" },
                },
            };
            return Challenge(properties, "Google");
        }

        [HttpGet("GoogleResponse")]
        public async Task<Response> GoogleResponse()
        {
            var userInfo = await HttpContext.AuthenticateAsync("Google");
            if (!userInfo.Succeeded)
            {
                return new Response(HttpStatusCode.Unauthorized, "Failed to authenticate with Google!");
            }
            var googleEmail = userInfo.Principal.FindFirst(ClaimTypes.Email)?.ToString();
            var user = await _userManager.FindByEmailAsync(googleEmail);
            if (user == null)
            {
                AppUser newUser = new AppUser()
                {
                    UserName = userInfo.Principal.FindFirst(ClaimTypes.Email)?.ToString(),
                    Email = userInfo.Principal.FindFirst(ClaimTypes.Email)?.ToString(),
                    fullName = userInfo.Principal.FindFirst(ClaimTypes.Name)?.ToString(),
                    date = DateTime.Parse(userInfo.Principal.FindFirst(ClaimTypes.DateOfBirth)?.ToString()),
                    isMale = userInfo.Principal.FindFirst(ClaimTypes.Gender)?.ToString() == "male",
                    PhoneNumber = userInfo.Principal.FindFirst(ClaimTypes.MobilePhone)?.ToString(),
                    address = userInfo.Principal.FindFirst(ClaimTypes.StreetAddress)?.ToString(),
                    isBlock = false,
                    createdDate = DateTime.Now,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
                var createUser = await _userManager.CreateAsync(newUser);
                if (!createUser.Succeeded)
                {
                    return new Response(HttpStatusCode.BadRequest, "User failed to create! Please check and try again!");
                }
                if (await _roleManager.RoleExistsAsync(TypeUser.Member.ToString()))
                {
                    await _userManager.AddToRoleAsync(newUser, TypeUser.Member.ToString());
                    return new Response(HttpStatusCode.NoContent, "User creates successfully!");
                }
                return new Response(HttpStatusCode.BadRequest, "User failed to create!");
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
    }
}