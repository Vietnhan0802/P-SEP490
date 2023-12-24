using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IConfiguration _configuration;

        public UserController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
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
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
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
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]));

            var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:ValidIssuer"],
                    audience: _configuration["Jwt:ValidAudience"],
                    expires: DateTime.Now.AddHours(3),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));
            return token;
        }
    }
}
