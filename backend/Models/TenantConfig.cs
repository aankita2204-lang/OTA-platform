using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace OtaBackend.Models;

public class TenantConfig
{
    [Key]
    [MaxLength(50)]
    public string TenantId { get; set; } = string.Empty;

    [Required]
    public string ConfigJson { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class SearchRequest
{
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public string TripType { get; set; } = "One Way";
    public string Tab { get; set; } = "flight";
    public string? Travelers { get; set; }
    public string? Class { get; set; }
    public string? DepartureDate { get; set; }
    public string? ReturnDate { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class CreateTenantRequest
{
    public string TenantId { get; set; } = string.Empty;
    public string? ConfigJson { get; set; }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponse<T> Fail(string message) => new()
    {
        Success = false,
        Message = message
    };
}
