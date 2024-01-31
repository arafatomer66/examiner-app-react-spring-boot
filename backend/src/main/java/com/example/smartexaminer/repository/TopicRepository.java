package com.example.smartexaminer.repository;


import com.example.smartexaminer.model.entity.Subject;
import com.example.smartexaminer.model.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

    List<Topic> findBySubjectIdAndExamId(Integer subjectId, Integer examId);
    List<Topic> findBySubjectIdInAndExamId(Set<Integer> subjectId, Integer examId);
    Topic findOneBySubjectIdAndExamIdAndTitleIgnoreCase(Integer subjectId, Integer examId, String title);

    List<Topic> findByExamIdAndTitleInIgnoreCase(Integer examId, Set<String> title);


}