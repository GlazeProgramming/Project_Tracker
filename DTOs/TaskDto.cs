using System.ComponentModel.DataAnnotations;

namespace ProjectTracker.API.DTOs;

public class TaskDto
{
    public int TaskId { get; set; }
    public int ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public int? AssignedToUserId { get; set; }
    public string? AssignedToUsername { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTaskDto
{
    [Required]
    public int ProjectId { get; set; }

    public int? AssignedToUserId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public string Priority { get; set; } = "Medium";

    [Required]
    public string Status { get; set; } = "Todo";

    public DateTime? DueDate { get; set; }
}

public class UpdateTaskDto
{
    public int? AssignedToUserId { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Required]
    public string Priority { get; set; } = "Medium";

    [Required]
    public string Status { get; set; } = "Todo";

    public DateTime? DueDate { get; set; }
}