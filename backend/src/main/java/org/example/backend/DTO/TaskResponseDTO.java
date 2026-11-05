package org.example.backend.DTO;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponseDTO {

    private Long id;

    private String name;

    private String description;

    private LocalDateTime created_at;

    private boolean isFinished;


}
