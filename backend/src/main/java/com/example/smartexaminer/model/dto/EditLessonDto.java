package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.model.entity.QuestionOptions;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EditLessonDto {
    Integer id;

    Integer topicId;

    Integer subjectId;

    String title;

    String url;
}
