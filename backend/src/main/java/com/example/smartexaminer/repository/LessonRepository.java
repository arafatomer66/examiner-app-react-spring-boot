package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.Lesson;
import com.example.smartexaminer.model.entity.Topic;
import com.example.smartexaminer.model.entity.user.Admin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
    List<Lesson> findBySubjectIdOrderByTopicIdAscSequenceAsc(Integer subjectId);
}