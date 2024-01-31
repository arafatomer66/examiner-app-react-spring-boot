package com.example.smartexaminer.model.dto;

import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.model.entity.user.Teacher;
import com.example.smartexaminer.model.enums.Role;
import com.example.smartexaminer.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.*;
import org.springframework.beans.BeanUtils;

import javax.validation.constraints.NotBlank;


@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {

    private Integer id;
    @NotBlank(message = "First name is required")
    private String firstName;
    @NotBlank(message = "Last name is required")
    private String lastName;
    @JsonSetter("userName")
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;
    private Status status;
    private Role role;
    private Object detail;
    @JsonSetter("display_name")
    private String displayName;
    @JsonSetter("roll_number")
    private Integer student_roll_number;
    private String confirmPassword;
    private Integer teacher_id;
    private Integer parent_id;
    private Integer student_id;
    public UserDto(User user) {
        BeanUtils.copyProperties(user,this);
    }

}
