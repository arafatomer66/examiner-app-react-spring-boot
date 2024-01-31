package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import javax.annotation.Nullable;
import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblimage")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT")
    private Integer id;

    @Column(name = "question_id")
    @Nullable
    private Integer question;

    @Transient()
    private Integer question_id;

    @Column(name = "module_id")
    private Integer module_id;

    @Column(name="type")
    private String type;

    @Column(name="imageUrl")
    private String imageUrl;
}
