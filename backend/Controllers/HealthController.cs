using Microsoft.AspNetCore.Mvc;
using OtaBackend.Data;

namespace OtaBackend.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/health — health check for load balancers / monitoring
    [HttpGet]
    public async Task<ActionResult> Check()
    {
        var tenantCount = await Task.Run(() => _db.TenantConfigs.Count());

        return Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            version = "1.0.0",
            tenantCount,
            database = "connected"
        });
    }
}
