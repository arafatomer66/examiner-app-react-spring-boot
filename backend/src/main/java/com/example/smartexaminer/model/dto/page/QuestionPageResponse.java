package com.example.smartexaminer.model.dto.page;

import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.model.entity.Subject;
import com.example.smartexaminer.model.entity.Topic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class QuestionPageResponse {
    Page<Question> questionPage;
    Map<Integer, Subject> subjectMap;
    Map<Integer, Topic> topicMap;
}
