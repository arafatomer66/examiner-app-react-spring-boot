package com.example.smartexaminer.model.dto.bulk;

import com.example.smartexaminer.model.entity.ExamModule;
import com.example.smartexaminer.model.entity.Lesson;
import com.example.smartexaminer.model.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class BulkCreateLessonResponse {
    ArrayList<Lesson> lessonList;
}
