namespace ProjectTracker.API.Models;

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Project> OwnedProjects { get; set; } = new List<Project>();
    public ICollection<Task> AssignedTasks { get; set; } = new List<Task>();
}