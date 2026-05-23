using Microsoft.EntityFrameworkCore;
using OtaBackend.Data;
using OtaBackend.Models;

namespace OtaBackend.Services;

public class TenantService : ITenantService
{
    private readonly AppDbContext _db;
    private readonly ILogger<TenantService> _logger;

    public TenantService(AppDbContext db, ILogger<TenantService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<List<string>> GetAllTenantIdsAsync()
    {
        _logger.LogInformation("Fetching all tenant IDs");
        return await _db.TenantConfigs
            .Select(t => t.TenantId)
            .OrderBy(id => id)
            .ToListAsync();
    }

    public async Task<string?> GetConfigAsync(string tenantId)
    {
        _logger.LogInformation("Fetching config for tenant: {TenantId}", tenantId);
        var row = await _db.TenantConfigs.FindAsync(tenantId);
        if (row == null)
        {
            _logger.LogWarning("Tenant not found: {TenantId}", tenantId);
            return null;
        }
        return row.ConfigJson;
    }

    public async Task<bool> SaveConfigAsync(string tenantId, string configJson)
    {
        _logger.LogInformation("Saving config for tenant: {TenantId}", tenantId);

        var row = await _db.TenantConfigs.FindAsync(tenantId);
        if (row == null)
        {
            _db.TenantConfigs.Add(new TenantConfig
            {
                TenantId = tenantId,
                ConfigJson = configJson,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
            _logger.LogInformation("Created new tenant config: {TenantId}", tenantId);
        }
        else
        {
            row.ConfigJson = configJson;
            row.UpdatedAt = DateTime.UtcNow;
            _logger.LogInformation("Updated existing tenant config: {TenantId}", tenantId);
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ResetConfigAsync(string tenantId)
    {
        _logger.LogInformation("Resetting config for tenant: {TenantId}", tenantId);

        var row = await _db.TenantConfigs.FindAsync(tenantId);
        if (row != null)
        {
            _db.TenantConfigs.Remove(row);
            await _db.SaveChangesAsync();
        }

        // Re-seed from JSON file (critical for InMemory DB)
        var seedFile = Path.Combine(AppContext.BaseDirectory, "Seed", $"{tenantId}.json");
        if (File.Exists(seedFile))
        {
            var seedJson = await File.ReadAllTextAsync(seedFile);
            _db.TenantConfigs.Add(new TenantConfig
            {
                TenantId = tenantId,
                ConfigJson = seedJson,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            });
            await _db.SaveChangesAsync();
            _logger.LogInformation("Re-seeded tenant from JSON: {TenantId}", tenantId);
        }
        else
        {
            _logger.LogWarning("No seed file found for tenant: {TenantId}", tenantId);
        }

        return true;
    }

    public async Task<List<TenantConfig>> GetAllRowsAsync()
    {
        _logger.LogInformation("Fetching all DB rows (DB inspector)");
        return await _db.TenantConfigs
            .OrderBy(t => t.TenantId)
            .ToListAsync();
    }
}
