package org.example.backend.Service;


import jakarta.transaction.Transactional;
import org.example.backend.DTO.TaskRequestDTO;
import org.example.backend.DTO.TaskResponseDTO;
import org.example.backend.Entity.Task;
import org.example.backend.Repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {


    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository){

        this.taskRepository=taskRepository;
    }



//    ----------- CREATE A NEW TASK ---------------

    public Task createTask(TaskRequestDTO taskRequestDTO){

        Task task = new Task();

        task.setName(taskRequestDTO.getName());
        task.setDescription(taskRequestDTO.getDescription());

        taskRepository.save(task);

        return task;

    }

    //    --------------- GET ALL TASKS with deleted false -----------------


    public List<TaskResponseDTO> getAllTasksNotDeleted() {

        return taskRepository.findByDeletedAtIsNotNull()
                .stream()
                .map(task -> {

                    TaskResponseDTO dto = new TaskResponseDTO();

                    dto.setId(task.getId());
                    dto.setName(task.getName());
                    dto.setDescription(task.getDescription());
                    dto.setFinished(task.isFinished());

                    return dto;
                })
                .toList();
    }


//    --------------- GET ALL TASKS -----------------


    public List<TaskResponseDTO> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(task -> {

                    TaskResponseDTO dto = new TaskResponseDTO();

                    dto.setId(task.getId());
                    dto.setName(task.getName());
                    dto.setDescription(task.getDescription());
                    dto.setFinished(task.isFinished());

                    return dto;
                })
                .toList();
    }

//    ---------- get task by id ----------------

    public TaskResponseDTO getById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found with ID: " + id));

        TaskResponseDTO dto = new TaskResponseDTO();

        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setFinished(task.isFinished());

        return dto;
    }



    //    ---------- get task by name ----------------

    public List<TaskResponseDTO> getByName(String name) {

        return taskRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(task -> {

                    TaskResponseDTO dto = new TaskResponseDTO();

                    dto.setId(task.getId());
                    dto.setName(task.getName());
                    dto.setDescription(task.getDescription());
                    dto.setFinished(task.isFinished());

                    return dto;
                })
                .toList();
    }


    //    ---------- update task by name ----------------

    public Task updateTask(Long id, TaskRequestDTO taskRequestDTO) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Task not found with ID: " + id
                ));

        task.setName(taskRequestDTO.getName());
        task.setDescription(taskRequestDTO.getDescription());

        return taskRepository.save(task);
    }

//    ------------delete all task --------------

    public void softdeleteAllTask(){

        List<Task> tasks = taskRepository.findAll();

        LocalDateTime now = LocalDateTime.now();
        tasks.forEach(task -> task.setDeletedAt(now));

        taskRepository.saveAll(tasks);


    }


    //    ------------delete task bu id --------------

    public void softdeleteTaskById(Long id) {

        Task task = taskRepository.findById(id).orElseThrow(()->
                new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found"));


        if(task.getDeletedAt()!=null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,"Task already in trash"
            );
        }

        task.setDeletedAt(LocalDateTime.now());

        taskRepository.save(task);
    }


//    -------------- get all trash tasks --------------

    public List<TaskResponseDTO> getTrash() {

        return taskRepository.findByDeletedAtIsNotNull()
                .stream()
                .map(task -> {

                    TaskResponseDTO dto = new TaskResponseDTO();

                    dto.setId(task.getId());
                    dto.setName(task.getName());
                    dto.setDescription(task.getDescription());
                    dto.setFinished(task.isFinished());

                    return dto;
                })
                .toList();
    }



//    -------- restore by id ---------------

    public void restoreById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        if (task.getDeletedAt() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Task is not in trash");
        }

        task.setDeletedAt(null);

        taskRepository.save(task);
    }


//    ----------- restore all --------------

    @Transactional
    public void restoreAll() {

        List<Task> tasks = taskRepository.findByDeletedAtIsNotNull();

        tasks.forEach(task -> task.setDeletedAt(null));

        taskRepository.saveAll(tasks);
    }


//    ------- permnent delete by id ------------


    public void permanentDeleteById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Task not found"));

        if (task.getDeletedAt() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Move task to trash before permanent deletion");
        }

        taskRepository.delete(task);
    }


//    -------- perment delete all --------------

    @Transactional
    public void permanentDeleteAll() {

        List<Task> tasks = taskRepository.findByDeletedAtIsNotNull();

        taskRepository.deleteAll(tasks);
    }









}












