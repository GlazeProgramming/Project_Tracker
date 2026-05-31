using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Data;
using ProjectTracker.API.DTOs;
using ProjectTracker.API.Models;
using TaskModel = ProjectTracker.API.Models.Task;

namespace ProjectTracker.API.Services;

public interface ITaskService
{
    System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetAllAsync();
    System.Threading.Tasks.Task<TaskDto?> GetByIdAsync(int id);
    System.Threading.Tasks.Task<TaskDto> CreateAsync(CreateTaskDto dto);
    System.Threading.Tasks.Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto);
    System.Threading.Tasks.Task<bool> DeleteAsync(int id);
}

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async System.Threading.Tasks.Task<IEnumerable<TaskDto>> GetAllAsync()
    {
        return await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .Select(t => new TaskDto
            {
                TaskId = t.TaskId,
                ProjectId = t.ProjectId,
                ProjectName = t.Project.Name,
                AssignedToUserId = t.AssignedToUserId,
                AssignedToUsername = t.AssignedTo != null ? t.AssignedTo.Username : null,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority,
                Status = t.Status,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt
            }).ToListAsync();
    }

    public async System.Threading.Tasks.Task<TaskDto?> GetByIdAsync(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedTo)
            .FirstOrDefaultAsync(t => t.TaskId == id);

        if (task == null) return null;

        return new TaskDto
        {
            TaskId = task.TaskId,
            ProjectId = task.ProjectId,
            ProjectName = task.Project.Name,
            AssignedToUserId = task.AssignedToUserId,
            AssignedToUsername = task.AssignedTo?.Username,
            Title = task.Title,
            Description = task.Description,
            Priority = task.Priority,
            Status = task.Status,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt
        };
    }

    public async System.Threading.Tasks.Task<TaskDto> CreateAsync(CreateTaskDto dto)
    {
        var task = new TaskModel
        {
            ProjectId = dto.ProjectId,
            AssignedToUserId = dto.AssignedToUserId,
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            Status = dto.Status,
            DueDate = dto.DueDate
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(task.TaskId) ?? throw new Exception("Failed to retrieve created task.");
    }

    public async System.Threading.Tasks.Task<TaskDto?> UpdateAsync(int id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return null;

        task.AssignedToUserId = dto.AssignedToUserId;
        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Priority = dto.Priority;
        task.Status = dto.Status;
        task.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async System.Threading.Tasks.Task<bool> DeleteAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}