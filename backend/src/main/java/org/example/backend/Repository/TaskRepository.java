package org.example.backend.Repository;

import org.example.backend.Entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {

   Optional<Task> findByNameContainingIgnoreCase(String keyword);

   List<Task> findByDeletedAtIsNull();

   List<Task> findByDeletedAtIsNotNull();


}
