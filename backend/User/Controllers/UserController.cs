using BusinessObjects.Entities.User;
using BusinessObjects.Enums.User;
using BusinessObjects.ViewModels.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

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
                return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });
            }

            AppUser user = new AppUser()
            {
                UserName = signUpForPerson.fullName,
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
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User created fail! Please check and try again!" });
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Person.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Person.ToString());
                return StatusCode(StatusCodes.Status200OK, new Response { Status = "Success", Message = "User created & email sent to successfully!" });
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User failed to create!" });
        }

        [HttpPost("SignUpForBusiness")]
        public async Task<IActionResult> SignUpForBusiness(SignUpForBusiness signUpForBusiness)
        {
            var userExits = await _userManager.FindByEmailAsync(signUpForBusiness.email);
            if (userExits != null)
            {
                return StatusCode(StatusCodes.Status409Conflict, new Response { Status = "Error", Message = "User already exists!" });
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
                return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User created fail! Please check and try again!" });
            }
            if (await _roleManager.RoleExistsAsync(TypeUser.Business.ToString()))
            {
                await _userManager.AddToRoleAsync(user, TypeUser.Business.ToString());
                return StatusCode(StatusCodes.Status200OK, new Response { Status = "Success", Message = "User created & email sent to successfully!" });
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User failed to create!" });
        }
    }
}
