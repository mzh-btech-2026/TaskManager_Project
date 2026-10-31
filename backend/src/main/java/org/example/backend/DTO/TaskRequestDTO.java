package org.example.backend.DTO;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequestDTO {

    @NotBlank(message = "Task name is required")
    @Size(max = 100, message = "Task name cannot exceed 100 characters")

    private String name;
    private String description;

}
