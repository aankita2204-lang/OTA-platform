using Microsoft.AspNetCore.Mvc;
using OtaBackend.Models;
using OtaBackend.Services;
using System.Text.Json;

namespace OtaBackend.Controllers;

[ApiController]
[Route("api/db")]
public class DbInspectorController : ControllerBase
{
    private readonly ITenantService _tenantService;
    private readonly ILogger<DbInspectorController> _logger;

    public DbInspectorController(ITenantService tenantService, ILogger<DbInspectorController> logger)
    {
        _tenantService = tenantService;
        _logger = logger;
    }

    // GET /api/db/tables
    [HttpGet("tables")]
    public async Task<ActionResult> GetTables()
    {
        var rows = await _tenantService.GetAllRowsAsync();
        return Ok(new
        {
            database = "EF Core InMemory",
            databaseName = "OtaPlatformDb",
            tables = new[]
            {
                new
                {
                    name = "TenantConfigs",
                    columns = new[] { "TenantId (PK, string)", "ConfigJson (string)", "CreatedAt (DateTime)", "UpdatedAt (DateTime)" },
                    rowCount = rows.Count
                }
            }
        });
    }

    // GET /api/db/rows
    [HttpGet("rows")]
    public async Task<ActionResult> GetRows()
    {
        var rows = await _tenantService.GetAllRowsAsync();
        var result = rows.Select(r => new
        {
            r.TenantId,
            configSizeBytes = r.ConfigJson.Length,
            configSizeKB = Math.Round(r.ConfigJson.Length / 1024.0, 2),
            r.CreatedAt,
            r.UpdatedAt,
            lastModifiedAgo = DateTime.UtcNow - r.UpdatedAt,
            configPreview = r.ConfigJson.Length > 200 ? r.ConfigJson[..200] + "..." : r.ConfigJson
        });
        return Ok(ApiResponse<object>.Ok(result, "All rows from TenantConfigs table"));
    }

    // GET /api/db/rows/{tenantId}/full
    [HttpGet("rows/{tenantId}/full")]
    public async Task<ActionResult> GetFullRow(string tenantId)
    {
        var configJson = await _tenantService.GetConfigAsync(tenantId);
        if (configJson == null)
            return NotFound(ApiResponse<object>.Fail($"Row with TenantId='{tenantId}' not found"));

        var parsed = JsonSerializer.Deserialize<JsonElement>(configJson);
        var pretty = JsonSerializer.Serialize(parsed, new JsonSerializerOptions { WriteIndented = true });

        var rows = await _tenantService.GetAllRowsAsync();
        var row = rows.First(r => r.TenantId == tenantId);

        return Ok(new
        {
            tableName = "TenantConfigs",
            primaryKey = tenantId,
            createdAt = row.CreatedAt,
            updatedAt = row.UpdatedAt,
            columns = new Dictionary<string, object>
            {
                ["TenantId"] = row.TenantId,
                ["ConfigJson"] = parsed,
                ["CreatedAt"] = row.CreatedAt,
                ["UpdatedAt"] = row.UpdatedAt
            },
            rawJson = pretty
        });
    }

    // GET /api/db/compare/{tenantId}
    [HttpGet("compare/{tenantId}")]
    public async Task<ActionResult> CompareWithSeed(string tenantId)
    {
        var configJson = await _tenantService.GetConfigAsync(tenantId);
        if (configJson == null)
            return NotFound(ApiResponse<object>.Fail($"Row with TenantId='{tenantId}' not found"));

        var seedFile = Path.Combine(AppContext.BaseDirectory, "Seed", $"{tenantId}.json");
        if (!System.IO.File.Exists(seedFile))
            return NotFound(ApiResponse<object>.Fail($"Seed file not found for {tenantId}"));

        var seedJson = await System.IO.File.ReadAllTextAsync(seedFile);
        var dbParsed = JsonSerializer.Deserialize<JsonElement>(configJson);
        var seedParsed = JsonSerializer.Deserialize<JsonElement>(seedJson);

        var diffs = FindDiffs("", seedParsed, dbParsed);

        return Ok(new
        {
            tenantId,
            seedFile,
            differences = diffs,
            hasChanges = diffs.Count > 0,
            summary = diffs.Count == 0
                ? "DB row matches seed JSON exactly - no edits saved yet"
                : $"{diffs.Count} field(s) differ from seed (edits were saved via editor)"
        });
    }

    private static List<object> FindDiffs(string path, JsonElement seed, JsonElement db)
    {
        var diffs = new List<object>();

        if (seed.ValueKind == JsonValueKind.Object && db.ValueKind == JsonValueKind.Object)
        {
            var allKeys = seed.EnumerateObject().Select(p => p.Name)
                .Concat(db.EnumerateObject().Select(p => p.Name))
                .ToHashSet();

            foreach (var key in allKeys)
            {
                var hasSeed = seed.TryGetProperty(key, out var seedVal);
                var hasDb = db.TryGetProperty(key, out var dbVal);
                var subPath = string.IsNullOrEmpty(path) ? key : $"{path}.{key}";

                if (!hasSeed)
                    diffs.Add(new { path = subPath, change = "Added in DB", seedValue = "(missing)", dbValue = dbVal.ToString() });
                else if (!hasDb)
                    diffs.Add(new { path = subPath, change = "Removed from DB", seedValue = seedVal.ToString(), dbValue = "(missing)" });
                else
                    diffs.AddRange(FindDiffs(subPath, seedVal, dbVal));
            }
        }
        else if (seed.ValueKind == JsonValueKind.Array && db.ValueKind == JsonValueKind.Array)
        {
            var seedArr = seed.EnumerateArray().ToList();
            var dbArr = db.EnumerateArray().ToList();
            if (seedArr.Count != dbArr.Count)
                diffs.Add(new { path = $"{path}[]", change = "Array length changed", seedValue = seedArr.Count, dbValue = dbArr.Count });
        }
        else if (seed.ToString() != db.ToString())
        {
            diffs.Add(new { path, change = "Modified", seedValue = seed.ToString(), dbValue = db.ToString() });
        }

        return diffs;
    }
}
