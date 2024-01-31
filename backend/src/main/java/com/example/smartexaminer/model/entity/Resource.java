package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblresource")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Column(name="title")
    String title;

    @Column(name="url")
    String url;

    @Column(name="downloadable")
    String isDownloadable;
}
