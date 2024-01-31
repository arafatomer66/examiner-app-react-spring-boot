package com.example.smartexaminer.model.entity.user;

import com.example.smartexaminer.model.entity.User;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tblstudent")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT")
    private Integer id;

    @Column(name="parent_id")
    private Integer parentId;

    @NotNull
    @Column(name="user_id")
    private Integer userId;

//    @NotNull
    @Column(name="roll_number")
    private Integer rollNumber;

    @NotNull
    @Column(name="teacher_id")
    private Integer teacherId;

}
