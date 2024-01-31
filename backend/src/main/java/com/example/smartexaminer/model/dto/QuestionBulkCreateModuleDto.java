package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.QuestionOptions;
import com.example.smartexaminer.model.entity.user.Teacher;
import com.example.smartexaminer.model.enums.QuestionStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class QuestionBulkCreateModuleDto {

    private String topicIds;

    private String subjectIds;

    private String examIds;

}
