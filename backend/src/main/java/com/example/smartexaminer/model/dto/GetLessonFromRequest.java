package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.enums.QuestionStatus;
import lombok.Data;

import javax.annotation.Nullable;
import javax.validation.constraints.Null;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetLessonFromRequest {
    Integer subjectId;
    Integer examId;
}