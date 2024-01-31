package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.Topic;
import com.example.smartexaminer.model.entity.user.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findOneByUserId(Integer userId);

}