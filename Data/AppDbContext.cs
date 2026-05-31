using Microsoft.EntityFrameworkCore;
using ProjectTracker.API.Models;
using TaskModel = ProjectTracker.API.Models.Task; 

namespace ProjectTracker.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<TaskModel> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.UserId);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Project
        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(p => p.ProjectId);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
            entity.Property(p => p.Status).HasMaxLength(20);
            entity.HasOne(p => p.Owner)
                  .WithMany(u => u.OwnedProjects)
                  .HasForeignKey(p => p.OwnerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Task
        modelBuilder.Entity<TaskModel>(entity =>
        {
            entity.HasKey(t => t.TaskId);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(150);
            entity.Property(t => t.Priority).HasMaxLength(10);
            entity.Property(t => t.Status).HasMaxLength(20);
            entity.HasOne(t => t.Project)
                  .WithMany(p => p.Tasks)
                  .HasForeignKey(t => t.ProjectId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(t => t.AssignedTo)
                  .WithMany(u => u.AssignedTasks)
                  .HasForeignKey(t => t.AssignedToUserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }
}