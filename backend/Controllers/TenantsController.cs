using Microsoft.AspNetCore.Mvc;
using OtaBackend.Models;
using OtaBackend.Services;

namespace OtaBackend.Controllers;

[ApiController]
[Route("api/tenants")]
public class TenantsController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly ILogger<TenantsController> _logger;

    public TenantsController(ITenantService tenantService, ILogger<TenantsController> logger)
    {
        _tenantService = tenantService;
        _logger = logger;
    }

    // GET /api/tenants — list all available tenant IDs
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetAll()
    {
        var tenants = await _tenantService.GetAllTenantIdsAsync();
        return Ok(ApiResponse<List<string>>.Ok(tenants));
    }

    // GET /api/tenants/{id}/config — get tenant config JSON
    [HttpGet("{id}/config")]
    public async Task<ActionResult> GetConfig(string id)
    {
        var configJson = await _tenantService.GetConfigAsync(id);
        if (configJson == null)
            return NotFound(new { success = false, message = $"Tenant '{id}' not found" });

        return Content(configJson, "application/json");
    }

    // POST /api/tenants — create a new tenant config
    [HttpPost]
    public async Task<ActionResult<ApiResponse<object>>> CreateTenant([FromBody] CreateTenantRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.TenantId))
            return BadRequest(ApiResponse<object>.Fail("TenantId is required"));

        var existing = await _tenantService.GetConfigAsync(req.TenantId);
        if (existing != null)
            return Conflict(ApiResponse<object>.Fail($"Tenant '{req.TenantId}' already exists"));

        var success = await _tenantService.SaveConfigAsync(req.TenantId, req.ConfigJson ?? "{}");
        if (!success)
            return StatusCode(500, ApiResponse<object>.Fail("Failed to create tenant"));

        _logger.LogInformation("Tenant created: {TenantId}", req.TenantId);
        return CreatedAtAction(nameof(GetConfig), new { id = req.TenantId },
            ApiResponse<object>.Ok(new { tenantId = req.TenantId }, "Tenant created successfully"));
    }

    // PUT /api/tenants/{id}/config — save/update tenant config
    [HttpPut("{id}/config")]
    public async Task<ActionResult<ApiResponse<object>>> SaveConfig(string id)
    {
        using var reader = new StreamReader(Request.Body);
        var json = await reader.ReadToEndAsync();

        if (string.IsNullOrWhiteSpace(json))
            return BadRequest(ApiResponse<object>.Fail("Config JSON cannot be empty"));

        var success = await _tenantService.SaveConfigAsync(id, json);
        if (!success)
            return StatusCode(500, ApiResponse<object>.Fail("Failed to save config"));

        _logger.LogInformation("Config saved for tenant: {TenantId}", id);
        return Ok(ApiResponse<object>.Ok(new { tenantId = id }, "Saved successfully"));
    }

    // DELETE /api/tenants/{id}/config — reset to seed defaults
    [HttpDelete("{id}/config")]
    public async Task<ActionResult<ApiResponse<object>>> ResetConfig(string id)
    {
        var success = await _tenantService.ResetConfigAsync(id);
        if (!success)
            return StatusCode(500, ApiResponse<object>.Fail("Failed to reset config"));

        _logger.LogInformation("Config reset for tenant: {TenantId}", id);
        return Ok(ApiResponse<object>.Ok(new { tenantId = id }, "Reset to defaults"));
    }
}
