using Microsoft.AspNetCore.Mvc;
using ProjectTracker.API.DTOs;
using ProjectTracker.API.Services;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // GET /api/users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }

    // GET /api/users/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null) return NotFound(new { message = $"User with ID {id} not found." });
        return Ok(user);
    }

    // POST /api/users
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var user = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = user.UserId }, user);
    }

    // PUT /api/users/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var user = await _userService.UpdateAsync(id, dto);
        if (user == null) return NotFound(new { message = $"User with ID {id} not found." });
        return Ok(user);
    }

    // DELETE /api/users/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteAsync(id);
        if (!result) return NotFound(new { message = $"User with ID {id} not found." });
        return Ok(new { message = $"User with ID {id} deleted successfully." });
    }
}