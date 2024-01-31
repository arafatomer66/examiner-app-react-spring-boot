package com.example.smartexaminer.model.dto.attempt;

import com.example.smartexaminer.model.dto.ExamModuleWithQuestions;
import com.example.smartexaminer.model.entity.test.AttemptHistory;
import lombok.Data;

@Data
public class AttemptHistoryAndModuleWithQuestions {
    AttemptHistory attemptHistory;
    ExamModuleWithQuestions examModuleWithQuestions;
}
