using System.ComponentModel.DataAnnotations;

namespace ProjectTracker.API.DTOs;

public class ProjectDto
{
    public int ProjectId { get; set; }
    public int OwnerId { get; set; }
    public string OwnerUsername { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateProjectDto
{
    [Required]
    public int OwnerId { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public string Status { get; set; } = "Active";
}

public class UpdateProjectDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    public string Status { get; set; } = "Active";
}