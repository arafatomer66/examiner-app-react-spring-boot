package com.example.smartexaminer.model.entity;

import com.example.smartexaminer.model.entity.user.Teacher;
import com.example.smartexaminer.model.enums.QuestionStatus;
import com.example.smartexaminer.model.enums.QuestionType;
import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.beans.BeanUtils;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblquestion")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
//@JsonInclude(JsonInclude.Include.NON_ABSENT )
@EqualsAndHashCode(exclude = { "options", "explanation" })
@ToString(exclude = { "options", "explanation" })
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Transient
    private String topicName;

    @Column(name="topic_id")
    private Integer topic_id;

    @Column(name="key")
    private String key;

    @Transient
    private String subjectName;

    @Column(name="subject_id")
    private Integer subject_id;

    @Column(name="exam_id")
    private Integer exam_id;

    @Column(name="text", columnDefinition = "TEXT")
    private String text;

    @Column(name="image_url")
    private String imageUrl;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    @JsonIgnore
    private Teacher teacher;

    @Column(name="reviewer_at")
    private Date reviewedAt;

    @Column(name="difficulty")
    private Integer difficulty;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "list_of_tags")
    private List<String> tagList;

    @Column(name="sequence")
    private Integer sequence;

    @CreationTimestamp
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime createdDateTime;

    @UpdateTimestamp
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime updatedDateTime;

    @Enumerated(EnumType.STRING)
    @Column(name="status")
    private QuestionStatus questionStatus;

    @Enumerated(EnumType.STRING)
    @Column(name="type")
    private QuestionType type;

    @Column(name="comment", columnDefinition = "TEXT default ''")
    private String comment;

    @OneToMany(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy = "question")
    @JsonIgnoreProperties(value = {"question", "hibernateLazyInitializer"},  allowSetters=true)
    @OrderBy("key")
    private List<QuestionOptions> options = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade=CascadeType.ALL, mappedBy = "question")
    @JsonIgnoreProperties(value = {"question", "hibernateLazyInitializer"},  allowSetters=true)
    private Explanation explanation;

    public Question(Question question){
        BeanUtils.copyProperties(question,this);
    }

    public void setId(Integer id) {
        if(id != null) this.id = id;
    }

    public void setReviewedAt(Date reviewedAt) {
        if(reviewedAt != null) this.reviewedAt = reviewedAt;
    }

    public void setDifficulty(Integer difficulty) {
        if(difficulty != null) this.difficulty = difficulty;
    }

    public void setImageUrl(@Nullable String url) {
        if (url!=null && url.trim().isEmpty()){
            this.imageUrl = null;
        }
        else {
            this.imageUrl = url;
        }
    }


    public void setStatus(QuestionStatus status) {
        if(status != null) this.questionStatus = status;
    }

    public void setComment(@Nullable String comment) {
        if(comment != null) { this.comment = comment; }
    }



}
