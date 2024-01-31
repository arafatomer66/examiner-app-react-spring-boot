package com.example.smartexaminer.model.entity.test;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblattempthistory")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AttemptHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Column(name="module_id")
    private Integer moduleId;

    @Column(name="user_id")
    private Integer userId;

    @Column(name="grade")
    private String grade;

    @Column(name="count_question")
    private Integer totalQuestion=0;

    @Column(name="count_answer_missing")
    private Integer totalAnswerMissing=0;

    @Column(name="count_correct")
    private Integer totalCorrect=0;

    @Column(name="count_blank")
    private Integer totalBlank=0;

    @Column(name="percentage")
    private Double percentage=0.0;

    @Column(name="start_date_time")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime startDateTime;

    @Column(name="end_date_time")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime endDateTime;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "result")
    private Map<Integer, AttemptResult> result;
}
