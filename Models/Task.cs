namespace ProjectTracker.API.Models;

public class Task
{
    public int TaskId { get; set; }
    public int ProjectId { get; set; }
    public int? AssignedToUserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Todo";
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Project Project { get; set; } = null!;
    public User? AssignedTo { get; set; }
}