using OtaBackend.Models;

namespace OtaBackend.Data;

public static class SeedData
{
    public static void Initialize(AppDbContext db)
    {
        var seedDir = Path.Combine(AppContext.BaseDirectory, "Seed");
        if (!Directory.Exists(seedDir))
        {
            Console.WriteLine("[SeedData] Seed directory not found, skipping seed");
            return;
        }

        foreach (var file in Directory.GetFiles(seedDir, "*.json"))
        {
            var tenantId = Path.GetFileNameWithoutExtension(file);
            if (db.TenantConfigs.Any(t => t.TenantId == tenantId))
                continue;

            var json = File.ReadAllText(file);
            db.TenantConfigs.Add(new TenantConfig
            {
                TenantId = tenantId,
                ConfigJson = json,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });
            Console.WriteLine($"[SeedData] Seeded tenant: {tenantId}");
        }

        db.SaveChanges();
    }
}
