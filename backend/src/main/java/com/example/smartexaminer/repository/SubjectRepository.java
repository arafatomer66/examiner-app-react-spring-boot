package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
    List<Subject> findSubjectByExamIdAndTeacherId(Integer examId, Integer teacherId);

    List<Subject> findSubjectByExamIdAndTeacherIdAndTitleIgnoreCaseIn(
            Integer examId, Integer teacherId, Set<String> names
    );

    List<Subject> findSubjectByExamIdAndTitleInIgnoreCase(
            Integer examId, Set<String> nameList
    );

    Subject findOneSubjectByExamIdAndTeacherIdAndTitleIgnoreCase(Integer examId, Integer teacherId, String title);



}