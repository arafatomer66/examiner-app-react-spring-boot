package com.example.smartexaminer.model.entity;

import com.example.smartexaminer.model.entity.user.Teacher;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.UpdateTimestamp;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.Null;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblexammodule")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExamModule {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    @JsonIgnore
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", referencedColumnName="id",  nullable = false)
    @OnDelete(action = OnDeleteAction.NO_ACTION)
    @JsonIgnore
    private Exam exam;

    @CreationTimestamp
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updatedDateTime;

    @Column(name="sequence")
    private Integer sequence = 0;

    @Nullable
    @Column(name="name")
    private String name;

    @Nullable
    @Column(name="fileName")
    private String fileName;

    @Column(name="time_in_minutes", columnDefinition = "int default 60")
    private Integer timeInMinutes=60;

    @Column(name="questions", columnDefinition = "TEXT")
//    @Convert(converter = StringToArrayConverter.class)
    private String questions;

    public List<Integer> findQuestionsAsList(){

        if (questions==null) {
            return new ArrayList<>();
        }
        String questionIdString= questions.trim();

        String[] parts = questionIdString.split(",");
        if (questionIdString.isEmpty()){
            this.questions = "";
            return new ArrayList<>();
        }
        List<Integer> integerList = new ArrayList<>();
        for (String part : parts) {
            integerList.add(Integer.parseInt(part));
        }
        return integerList;
    }

    public String storeQuestionsAsString(List<Integer> integerList){
        StringBuilder result = new StringBuilder();
        this.questions = result.toString();

        int length = integerList.size();
                for (int i = 0; i < length; i++) {
                    result.append(integerList.get(i));
                    if (i < length - 1 || length > 1) {
                        result.append(",");
                    }
                }

        this.questions = result.toString();
        return this.questions;
    }

}
