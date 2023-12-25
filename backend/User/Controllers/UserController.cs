using AutoMapper;
using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace User.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IMapper mapper, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet("GetAllUsers")]
        public async Task<ActionResult<List<Account>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            if (users == null || users.Count < 0)
            {
                return NotFound("User is empty!");
            }
            return _mapper.Map<List<Account>>(users);
        }

        [HttpPost("SignUpForPerson")]
        public async Task<IActionResult> SignUpForPerson(SignUpForPerson signUpForPerson)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForPerson.email);
            if (userExits != null)
            {
                return Conflict("Account already exists!");
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
                return BadRequest("Account created fail! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Person.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Person.ToString());
                return Ok("Account created & email sent to successfully!");
            }
            return BadRequest("Account failed to create!");
        }

        [HttpPost("SignUpForBusiness")]
        public async Task<IActionResult> SignUpForBusiness(SignUpForBusiness signUpForBusiness)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForBusiness.email);
            if (userExits != null)
            {
                return Conflict("Account already exists!");
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForBusiness.fullName,
                Email = signUpForBusiness.email,
                fullName = signUpForBusiness.fullName,
                birthday = signUpForBusiness.birthday,
                isMale = signUpForBusiness.isMale,
                PhoneNumber = signUpForBusiness.phone,
                tax = signUpForBusiness.tax,
                address = signUpForBusiness.address,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, signUpForBusiness.password);
            if (!result.Succeeded)
            {
                return BadRequest("Account created fail! Please check and try again!");
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Business.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Business.ToString());
                return Ok("Account created & email sent to successfully!");
            }
            return BadRequest("Account failed to create!");
        }

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(SignIn signIn)
        {
            var user = await _userManager.FindByEmailAsync(signIn.email);
            if (user != null && await _userManager.CheckPasswordAsync(user, signIn.password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, _configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
                    new Claim(ClaimTypes.Role, userRoles.ToString()),
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
                /*foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }*/

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
    }
}
