using OtaBackend.Models;

namespace OtaBackend.Services;

public interface ITenantService
{
    Task<List<string>> GetAllTenantIdsAsync();
    Task<string?> GetConfigAsync(string tenantId);
    Task<bool> SaveConfigAsync(string tenantId, string configJson);
    Task<bool> ResetConfigAsync(string tenantId);
    Task<List<TenantConfig>> GetAllRowsAsync();
}
