using BusinessObjects.Entities.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace User.Data
{
    public class AppDBContext : IdentityDbContext<AppUser>
    {

        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options) {}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            SeedDatas(builder);
        }

        private static void SeedDatas(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = "aeb27c30-d31d-43ec-9465-d04bf75d0f0d", Name = "Admin", ConcurrencyStamp = "1", NormalizedName = "Admin" },
                new IdentityRole { Name = "Member", ConcurrencyStamp = "2", NormalizedName = "Member" },
                new IdentityRole { Name = "Business", ConcurrencyStamp = "3", NormalizedName = "Business" });

            var hasher = new PasswordHasher<AppUser>();

            builder.Entity<AppUser>().HasData(
                new AppUser
                {
                    Id = "b80546cd-f4df-4a46-842e-22d3f9018ce3",
                    UserName = "admin@gmail.com",
                    NormalizedUserName = "ADMIN@GMAIL.COM",
                    Email = "admin@gmail.com",
                    NormalizedEmail = "ADMIN@GMAIL.COM",
                    EmailConfirmed = true,
                    fullName = "Đầu bự vô địch",
                    isMale = true,
                    PhoneNumber = "0949180802",
                    tax = "1234567890",
                    address = "Bến Tre",
                    description = "Tao là admin! Web này tao là bố!",
                    isBlock = false,
                    createdDate = DateTime.Now,
                    LockoutEnabled = true,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    PasswordHash = hasher.HashPassword(null, "12345")
                }
            );

            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>
                {
                    RoleId = "aeb27c30-d31d-43ec-9465-d04bf75d0f0d",
                    UserId = "b80546cd-f4df-4a46-842e-22d3f9018ce3"
                }
            );
        }
    }
}
