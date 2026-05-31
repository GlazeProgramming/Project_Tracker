using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Data;
using ProjectTracker.API.DTOs;
using ProjectTracker.API.Models;

namespace ProjectTracker.API.Services;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllAsync();
    Task<ProjectDto?> GetByIdAsync(int id);
    Task<ProjectDto> CreateAsync(CreateProjectDto dto);
    Task<ProjectDto?> UpdateAsync(int id, UpdateProjectDto dto);
    Task<bool> DeleteAsync(int id);
}

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllAsync()
    {
        return await _context.Projects
            .Include(p => p.Owner)
            .Select(p => new ProjectDto
            {
                ProjectId = p.ProjectId,
                OwnerId = p.OwnerId,
                OwnerUsername = p.Owner.Username,
                Name = p.Name,
                Description = p.Description,
                Status = p.Status,
                CreatedAt = p.CreatedAt
            }).ToListAsync();
    }

    public async Task<ProjectDto?> GetByIdAsync(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Owner)
            .FirstOrDefaultAsync(p => p.ProjectId == id);

        if (project == null) return null;

        return new ProjectDto
        {
            ProjectId = project.ProjectId,
            OwnerId = project.OwnerId,
            OwnerUsername = project.Owner.Username,
            Name = project.Name,
            Description = project.Description,
            Status = project.Status,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectDto dto)
    {
        var project = new Project
        {
            OwnerId = dto.OwnerId,
            Name = dto.Name,
            Description = dto.Description,
            Status = dto.Status
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(project.ProjectId) ?? throw new Exception("Failed to retrieve created project.");
    }

    public async Task<ProjectDto?> UpdateAsync(int id, UpdateProjectDto dto)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return null;

        project.Name = dto.Name;
        project.Description = dto.Description;
        project.Status = dto.Status;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return false;

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return true;
    }
}