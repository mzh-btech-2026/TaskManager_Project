
package org.example.backend.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(
        name = "tasks",
        indexes = {
                @Index(
                        name = "idx_task_name",
                        columnList = "name"
                ),
                @Index(
                        name = "idx_task_deleted_at",
                        columnList = "deleted_at"
                )
        }
)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;


    @NotBlank(message = "Task name is required")
    @Size(max = 150, message = "Task name cannot exceed 150 characters")
    @Column(
            name = "name",
            nullable = false,
            length = 150
    )
    private String name;


    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column(
            name = "description",
            columnDefinition = "TEXT"
    )
    private String description;


    @Column(
            name = "created_at",
            updatable = false
    )
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;


    @Column(name = "is_finished", nullable = false)
    private boolean isFinished = false;


    // Automatically executes before inserting a new task
    @PrePersist
    public void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }


    // Automatically executes before updating an existing task
    @PreUpdate
    public void onUpdate() {

        this.updatedAt = LocalDateTime.now();
    }

}
