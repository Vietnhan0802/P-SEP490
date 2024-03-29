using BlogService;
using BlogService.Data;
using BusinessObjects.Mappers;
using Commons.Helpers;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddAutoMapper(typeof(MapperProfile));
builder.Services.AddDbContext<AppDBContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("AppDB")));
builder.Services.AddScoped<SaveImageService>();

builder.Services.AddHangfire(options => options.UseSqlServerStorage(builder.Configuration.GetConnectionString("AppDB")));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "Images")),
    RequestPath = "/Images"
});

app.UseHttpsRedirection();

app.UseCors(options =>
{
    options.WithOrigins("http://localhost:3000")
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials();
});

app.UseAuthorization();

app.UseHangfireDashboard();

app.UseHangfireServer();

RecurringJob.AddOrUpdate<BlogScheduledJobs>("ResetViewInDateDaily", x => x.ResetViewInDateDaily(), "0 0 * * *");

app.MapControllers();

app.Run();
