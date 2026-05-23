using Microsoft.AspNetCore.Mvc;
using OtaBackend.Models;

namespace OtaBackend.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    // POST /api/search — mock search endpoint
    // Replace with real search API integration later
    [HttpPost]
    public ActionResult<ApiResponse<object>> Search([FromBody] SearchRequest req)
    {
        var results = req.Tab switch
        {
            "flight" => GetMockFlights(req),
            "hotel" => GetMockHotels(req),
            _ => GetMockPackages(req)
        };

        return Ok(ApiResponse<object>.Ok(new
        {
            tab = req.Tab,
            from = req.From,
            to = req.To,
            results
        }));
    }

    private static object[] GetMockFlights(SearchRequest req) => new[]
    {
        new { airline = "IndiGo", code = "6E-234", dep = "06:00", arr = "08:15", duration = "2h 15m", stops = "Non-stop", price = "₹4,520", tag = "cheapest" },
        new { airline = "Air India", code = "AI-101", dep = "09:30", arr = "11:45", duration = "2h 15m", stops = "Non-stop", price = "₹6,800", tag = "" },
        new { airline = "Vistara", code = "UK-807", dep = "14:00", arr = "16:20", duration = "2h 20m", stops = "Non-stop", price = "₹7,350", tag = "recommended" },
        new { airline = "SpiceJet", code = "SG-456", dep = "18:45", arr = "21:00", duration = "2h 15m", stops = "Non-stop", price = "₹3,990", tag = "" },
        new { airline = "Akasa Air", code = "QP-112", dep = "22:00", arr = "00:15+1", duration = "2h 15m", stops = "Non-stop", price = "₹4,200", tag = "" }
    };

    private static object[] GetMockHotels(SearchRequest req) => new[]
    {
        new { name = "Grand Hyatt", stars = 5, location = "City Center", rating = 4.8, price = "₹12,500/night", tag = "luxury" },
        new { name = "Taj Palace", stars = 5, location = "Downtown", rating = 4.7, price = "₹9,800/night", tag = "" },
        new { name = "Novotel", stars = 4, location = "Airport Area", rating = 4.3, price = "₹5,200/night", tag = "popular" },
        new { name = "IBIS Budget", stars = 3, location = "Suburb", rating = 3.9, price = "₹2,400/night", tag = "" }
    };

    private static object[] GetMockPackages(SearchRequest req) => new[]
    {
        new { title = "Goa Beach Getaway", nights = 3, includes = "Flights + Hotel + Breakfast", price = "₹18,500", tag = "bestseller" },
        new { title = "Kerala Backwaters", nights = 4, includes = "Train + Houseboat + Meals", price = "₹22,000", tag = "" },
        new { title = "Rajasthan Heritage", nights = 5, includes = "Flights + Hotel + Tours", price = "₹35,000", tag = "premium" },
        new { title = "Manali Adventure", nights = 3, includes = "Bus + Camp + Activities", price = "₹8,500", tag = "" }
    };
}
