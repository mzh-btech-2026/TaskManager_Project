package org.example.backend.DTO;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TaskResponseDTO {

    private Long id;

    private String name;

    private String description;

    private boolean isFinished;


}
