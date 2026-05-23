using Microsoft.AspNetCore.Mvc;
using OtaBackend.Models;

namespace OtaBackend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    // POST /api/auth/login — demo login (accepts any credentials)
    // Replace with real authentication (JWT, OAuth, etc.) later
    [HttpPost("login")]
    public ActionResult<ApiResponse<object>> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email))
            return BadRequest(ApiResponse<object>.Fail("Email is required"));

        var username = req.Email.Split('@')[0];
        var token = $"demo-token-{Guid.NewGuid():N}";

        return Ok(ApiResponse<object>.Ok(new
        {
            username,
            email = req.Email,
            token,
            expiresAt = DateTime.UtcNow.AddHours(24).ToString("o")
        }, "Login successful"));
    }

    // POST /api/auth/logout
    [HttpPost("logout")]
    public ActionResult<ApiResponse<object>> Logout()
    {
        return Ok(ApiResponse<object>.Ok(new { }, "Logged out"));
    }
}
