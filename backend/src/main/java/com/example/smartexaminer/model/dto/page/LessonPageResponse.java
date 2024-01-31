package com.example.smartexaminer.model.dto.page;

import com.example.smartexaminer.model.entity.Lesson;
import com.example.smartexaminer.model.entity.Topic;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class LessonPageResponse {
    Map<Integer, List<Lesson>> lessonMap;
    Map<Integer, Topic> topicMap;
}
