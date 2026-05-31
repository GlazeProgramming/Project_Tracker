using Microsoft.AspNetCore.Mvc;
using ProjectTracker.API.DTOs;
using ProjectTracker.API.Services;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    // GET /api/tasks
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tasks = await _taskService.GetAllAsync();
        return Ok(tasks);
    }

    // GET /api/tasks/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _taskService.GetByIdAsync(id);
        if (task == null) return NotFound(new { message = $"Task with ID {id} not found." });
        return Ok(task);
    }

    // POST /api/tasks
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var task = await _taskService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = task.TaskId }, task);
    }

    // PUT /api/tasks/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var task = await _taskService.UpdateAsync(id, dto);
        if (task == null) return NotFound(new { message = $"Task with ID {id} not found." });
        return Ok(task);
    }

    // DELETE /api/tasks/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _taskService.DeleteAsync(id);
        if (!result) return NotFound(new { message = $"Task with ID {id} not found." });
        return Ok(new { message = $"Task with ID {id} deleted successfully." });
    }
}