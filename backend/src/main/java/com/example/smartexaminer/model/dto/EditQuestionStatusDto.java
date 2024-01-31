package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.enums.QuestionStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditQuestionStatusDto {
    QuestionStatus status;

    String comment;
}
