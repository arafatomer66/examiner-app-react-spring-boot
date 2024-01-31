package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tbllesson")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Transient
    String topicName;
    @Column(name="topic_id")
    Integer topicId;

    @Transient
    String subjectName;
    @Column(name="subject_id")
    Integer subjectId;

    @Column(name="title")
    String title;

    @Column(name="url")
    String url;

    @Column(name="sequence")
    Integer sequence;

}
