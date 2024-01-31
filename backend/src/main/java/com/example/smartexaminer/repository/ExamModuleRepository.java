package com.example.smartexaminer.repository;

import com.example.smartexaminer.model.entity.Exam;
import com.example.smartexaminer.model.entity.ExamModule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamModuleRepository extends JpaRepository<ExamModule, Integer> {
    Page<ExamModule> findAllByExamIdAndTeacherIdOrderByIdDesc(int examId, int teacherId, Pageable pageable);
    List<ExamModule> findAllByExamIdAndTeacherIdOrderByIdDesc(int examId, int teacherId);

}