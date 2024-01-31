package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.ExamModule;
import com.example.smartexaminer.model.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class ExamModuleWithQuestions {
    private ExamModule module;
    private Integer examId;
    private List<Question> questionList;
}
