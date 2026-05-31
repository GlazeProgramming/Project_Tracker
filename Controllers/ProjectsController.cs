using Microsoft.AspNetCore.Mvc;
using ProjectTracker.API.DTOs;
using ProjectTracker.API.Services;

namespace ProjectTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    // GET /api/projects
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await _projectService.GetAllAsync();
        return Ok(projects);
    }

    // GET /api/projects/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var project = await _projectService.GetByIdAsync(id);
        if (project == null) return NotFound(new { message = $"Project with ID {id} not found." });
        return Ok(project);
    }

    // POST /api/projects
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var project = await _projectService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = project.ProjectId }, project);
    }

    // PUT /api/projects/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var project = await _projectService.UpdateAsync(id, dto);
        if (project == null) return NotFound(new { message = $"Project with ID {id} not found." });
        return Ok(project);
    }

    // DELETE /api/projects/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _projectService.DeleteAsync(id);
        if (!result) return NotFound(new { message = $"Project with ID {id} not found." });
        return Ok(new { message = $"Project with ID {id} deleted successfully." });
    }
}