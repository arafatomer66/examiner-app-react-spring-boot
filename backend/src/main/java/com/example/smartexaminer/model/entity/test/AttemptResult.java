package com.example.smartexaminer.model.entity.test;

import com.example.smartexaminer.model.enums.QuestionResultType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttemptResult {
    QuestionResultType questionResultType;
    String submittedValue;

}
