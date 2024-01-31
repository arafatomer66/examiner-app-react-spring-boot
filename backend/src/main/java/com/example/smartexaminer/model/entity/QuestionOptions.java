package com.example.smartexaminer.model.entity;

import com.example.smartexaminer.model.enums.QuestionStatus;
import com.example.smartexaminer.model.enums.QuestionType;
import com.example.smartexaminer.model.enums.TypeQuesionOptions;
import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.checkerframework.common.aliasing.qual.Unique;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.annotation.Nullable;
import javax.persistence.*;
import javax.validation.constraints.Null;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblquestionoptions")
@JsonInclude(JsonInclude.Include.NON_NULL)
@EqualsAndHashCode(exclude = { "question" })
@ToString(exclude = { "question" })
public class QuestionOptions {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    private String key;

    private String value;

    private String imageUrl;

//    @Enumerated(EnumType.STRING)
//    @Column(name = "typequestionoptions")
//    private TypeQuesionOptions type;
//    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", referencedColumnName="id",  nullable = true)
    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Question question;


    public void setKey(String key) {
        if(key != null) this.key = key;
    }

    public void setValue(String value) {
        if(value != null) this.value = value;
    }

    public void setImageUrl(@Nullable String url) {
        if (url!=null && url.trim().isEmpty()) {
            this.imageUrl = null;
        }
        else{
            this.imageUrl = url;
        }
    }
}

