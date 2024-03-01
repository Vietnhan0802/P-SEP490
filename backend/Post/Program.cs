using BusinessObjects.Mappers;
using Commons.Helpers;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Post;
using Post.Data;

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

app.UseRouting();

app.UseCors(options =>
{
    options.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin();
});

app.UseAuthorization();

app.UseHangfireDashboard();

app.UseHangfireServer();

RecurringJob.AddOrUpdate<PostScheduledJobs>("ResetViewInDateDaily", x => x.ResetViewInDateDaily(), "0 0 * * *");

app.MapControllers();

app.Run();
