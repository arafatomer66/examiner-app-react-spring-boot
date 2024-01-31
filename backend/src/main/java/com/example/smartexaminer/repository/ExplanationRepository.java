package com.example.smartexaminer.repository;

import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.QuestionOptions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Integer> {
    Optional<Explanation> findOneExplanationByQuestionId(Integer questionId);
    List<Explanation> findExplanationByQuestionIdIn(List<Integer> questionIdList);

}
