package com.example.smartexaminer.model.dto.bulk;

import com.example.smartexaminer.model.enums.QuestionType;
import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class ExcelLessonMapper {
    @ExcelRow
    private int rowIndex;
    @ExcelCellName("Subject")
    private String subject;

    @ExcelCellName(value = "Topic")
    private String topic;
    @ExcelCellName("Title")
    private String title;
    @ExcelCellName("Lesson Url")
    private String lessonURL;
}
