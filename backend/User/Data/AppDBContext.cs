using BusinessObjects.Entities.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace User.Data
{
    public class AppDBContext : IdentityDbContext<Account>
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

            var hasher = new PasswordHasher<Account>();

            builder.Entity<Account>().HasData(
                new Account
                {
                    Id = "b80546cd-f4df-4a46-842e-22d3f9018ce3",
                    UserName = "peitcs.ad@gmail.com",
                    NormalizedUserName = "PEITCS.AD@GMAIL.COM",
                    Email = "peitcs.ad@gmail.com",
                    NormalizedEmail = "PEITCS.AD@GMAIL.COM",
                    EmailConfirmed = true,
                    fullName = "PEITCS",
                    date = new DateTime(2002, 8, 18),
                    isMale = true,
                    PhoneNumber = "0949180802",
                    tax = "1234567890",
                    address = "Bến Tre",
                    avatar = "default.png",
                    description = "Admin quản lý trang web công nghệ kết nối, tập trung và hiệu quả trong việc duy trì và phát triển nền tảng, không lãng phí thời gian vào những cuộc trò chuyện vô nghĩa.",
                    isVerified = true,
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
