package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tbltopic")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "exam_id", referencedColumnName = "id")
    @JsonIgnore
    private Exam exam;
    @Transient
    private Integer exam_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", referencedColumnName="id",  nullable = true)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Subject subject;
    @Transient
    private Integer subject_id;

    @Column(name="title")
    private String title;

    @Column(name="description")
    private String description;
}
