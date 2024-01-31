package com.example.smartexaminer.repository;

import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.model.enums.QuestionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.validation.constraints.Null;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    Page<Question> findAllByIdInOrderBySequenceAsc(List<Integer> questionId, Pageable page);
    @Query("select question " +
                   "from Question question where " +
                        "question.id in (:questionId) " +
                        "and ( coalesce(:subjectId, null) is null or question.subject_id in (:subjectId) ) " +
                        "and ( coalesce(:topicId, null) is null or question.topic_id in (:topicId) ) " +
                        "and ( coalesce(:difficulty, null) is null or question.difficulty in (:difficulty) ) "+
                        "and ( coalesce(:questionStatus, null) is null or question.questionStatus in (:questionStatus) ) " +
                    "order by question.sequence asc ")
    Page<Question> findAllByIdInOrderBySequenceAsc(
            List<Integer> questionId, List<Integer> subjectId, List<Integer> topicId,
            List<Integer> difficulty, List<QuestionStatus> questionStatus, Pageable page
            );
    List<Question> findAllByIdInOrderBySequenceAsc(List<Integer> questionId);

}
