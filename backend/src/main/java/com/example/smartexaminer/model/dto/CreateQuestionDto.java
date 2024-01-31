package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.model.entity.QuestionOptions;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateQuestionDto {
  Question question;

  @JsonSetter("options")
  List<QuestionOptions> optionList;

  @JsonSetter("explanation")
  Explanation explanation;
}
