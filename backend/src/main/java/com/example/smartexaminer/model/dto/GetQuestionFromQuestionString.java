package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.enums.QuestionStatus;
import lombok.Data;

import javax.validation.constraints.Null;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class GetQuestionFromQuestionString {
    private String questionString;
    private Integer examId;
    private Integer teacherId;
    @Null
    private List<Integer> subjectId;
    @Null
    private List<Integer> topicId;
    @Null
    private List<QuestionStatus> questionStatus;
    @Null
    private List<Integer> difficulty;
    public List<String> getQuestionStatusAsEnum(){
        System.out.printf("\n %s \n", questionStatus);
        if (questionStatus == null) {
            return new ArrayList<String>();
        }
        else return questionStatus.stream()
                .map(QuestionStatus::name)
                .collect(Collectors.toList())
        ;
    }

}