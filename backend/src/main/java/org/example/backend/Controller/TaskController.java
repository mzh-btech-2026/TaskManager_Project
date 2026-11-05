
package org.example.backend.Controller;

import jakarta.validation.Valid;
import org.example.backend.DTO.TaskRequestDTO;
import org.example.backend.DTO.TaskResponseDTO;
import org.example.backend.Entity.Task;
import org.example.backend.Service.TaskService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ------------ health check up -------------

    @GetMapping("/message")
    public String hello(){

        return "Hello zaheeeer";
    }


    // ----------- CREATE A NEW TASK ---------------

    @PostMapping("/")
    public ResponseEntity<Task> createTask(
            @Valid @RequestBody TaskRequestDTO taskRequestDTO) {

        Task task = taskService.createTask(taskRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }


    // ------------- GET ALL TASKS -----------------

    @GetMapping("/all")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasks() {

        List<TaskResponseDTO> tasks = taskService.getAllTasks();

        return ResponseEntity.ok(tasks);
    }


    // ------------- GET ALL ACTIVE TASKS -----------------

    @GetMapping("/get")
    public ResponseEntity<List<TaskResponseDTO>> getAllTasksNotDeleted() {

        List<TaskResponseDTO> tasks = taskService.getAllTasksNotDeleted();

        return ResponseEntity.ok(tasks);
    }


    // ------------- GET TASK BY ID -----------------

    @GetMapping("/id/{id}")
    public ResponseEntity<TaskResponseDTO> getById(
            @PathVariable Long id) {

        TaskResponseDTO task = taskService.getById(id);

        return ResponseEntity.ok(task);
    }


    // ------------- GET TASK BY NAME -----------------

    @GetMapping("/search/{name}")
    public ResponseEntity<List<TaskResponseDTO>> getByName(
            @PathVariable String name) {

        List<TaskResponseDTO> tasks = taskService.getByName(name);

        return ResponseEntity.ok(tasks);
    }


    // ------------- UPDATE TASK BY ID -----------------

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO taskRequestDTO) {

        Task task = taskService.updateTask(id, taskRequestDTO);

        return ResponseEntity.ok(task);
    }


    // ------------- SOFT DELETE TASK BY ID -----------------

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> softDeleteById(
            @PathVariable Long id) {

        taskService.softdeleteTaskById(id);

        return ResponseEntity.noContent().build();
    }


    // ------------- SOFT DELETE ALL TASKS -----------------

    @DeleteMapping("/all")
    public ResponseEntity<Void> softDeleteAll() {

        taskService.softdeleteAllTask();

        return ResponseEntity.noContent().build();
    }


    // ------------- GET ALL TRASH TASKS -----------------

    @GetMapping("/trash")
    public ResponseEntity<List<TaskResponseDTO>> getTrash() {

        List<TaskResponseDTO> tasks = taskService.getTrash();

        return ResponseEntity.ok(tasks);
    }


    // ------------- RESTORE TASK BY ID -----------------

    @PutMapping("/{id}/restore")
    public ResponseEntity<Void> restoreById(
            @PathVariable Long id) {

        taskService.restoreById(id);

        return ResponseEntity.noContent().build();
    }


    // ------------- RESTORE ALL TASKS -----------------

    @PutMapping("/trash/restore-all")
    public ResponseEntity<Void> restoreAll() {

        taskService.restoreAll();

        return ResponseEntity.noContent().build();
    }


    // ------------- PERMANENT DELETE BY ID -----------------

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentDeleteById(
            @PathVariable Long id) {

        taskService.permanentDeleteById(id);

        return ResponseEntity.noContent().build();
    }


    // ------------- PERMANENT DELETE ALL FROM TRASH -----------------

    @DeleteMapping("/trash/empty")
    public ResponseEntity<Void> permanentDeleteAll() {

        taskService.permanentDeleteAll();

        return ResponseEntity.noContent().build();
    }

    // ----- update the task -----------


    @PatchMapping("/{id}/completion")
    public Task updateTaskCompletion(
            @PathVariable Long id,
            @RequestParam boolean finished) {

        return taskService.updateTaskCompletion(id, finished);
    }

}
















