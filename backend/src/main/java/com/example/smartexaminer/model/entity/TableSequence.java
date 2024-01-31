package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tbltablesequence")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TableSequence {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT")
    private Integer id;

    @Column(name="sequence")
    private Integer sequence = 0;

    @Column(name="table_type")
    private String tableType;
}
