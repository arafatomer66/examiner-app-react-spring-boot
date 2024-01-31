package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.annotation.Nullable;
import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblexplanation")
@JsonInclude(JsonInclude.Include.NON_NULL)
@EqualsAndHashCode(exclude = { "question", })
@ToString(exclude = { "question" })
public class Explanation{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id", referencedColumnName = "id")
    @JsonIgnore
    private Question question;

    @Transient()
    private Integer question_id;

    @Nullable
    @Column(name="text")
    private String text;

    @Nullable
    @Column(name="video_url")
    private String videoUrl;

    @Column(name="image_url")
    private String imageUrl;

    @Column(name="correct_answer")
    private String correctAnswer;

    public void setImageUrl(@Nullable String url) {
        if (url!=null && url.trim().isEmpty()) {
            this.imageUrl = null;
        }
        else{
            this.imageUrl = url;
        }
    }

    public void setVideoUrl(@Nullable String url) {
        if (url!=null && url.trim().isEmpty()) {
            this.videoUrl = null;
        }
        else{
            this.videoUrl = url;
        }
    }
}
