using Microsoft.EntityFrameworkCore;
using OtaBackend.Data;
using OtaBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Service layer DI
builder.Services.AddScoped<ITenantService, TenantService>();

// Database: InMemory for local dev (no SQL Server needed), SQL Server for production
var useInMemory = builder.Configuration.GetValue<bool>("UseInMemoryDb", true);

if (useInMemory)
{
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseInMemoryDatabase("OtaPlatformDb"));
    Console.WriteLine("[DB] Using InMemory database (no SQL Server required)");
}
else
{
    builder.Services.AddDbContext<AppDbContext>(opt =>
        opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
    Console.WriteLine("[DB] Using SQL Server");
}

// CORS: Allow frontend dev server
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", p =>
    p.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
     .AllowAnyHeader()
     .AllowAnyMethod()));

// Health checks for production monitoring
builder.Services.AddHealthChecks();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Request logging middleware
app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    var start = DateTime.UtcNow;
    logger.LogInformation("{Method} {Path} started", context.Request.Method, context.Request.Path);
    await next();
    var elapsed = (DateTime.UtcNow - start).TotalMilliseconds;
    logger.LogInformation("{Method} {Path} completed {StatusCode} in {Elapsed}ms",
        context.Request.Method, context.Request.Path, context.Response.StatusCode, elapsed);
});

app.UseCors("AllowFrontend");
app.MapControllers();
app.MapHealthChecks("/health");

// Seed default tenant configs
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    SeedData.Initialize(db);
}

Console.WriteLine("OTA Platform Backend — Ready!");
Console.WriteLine("  API:    http://localhost:5000/api");
Console.WriteLine("  Docs:   http://localhost:5000/swagger");
Console.WriteLine("  Health: http://localhost:5000/api/health");

app.Run();
