package com.example.smartexaminer.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginDto {
    @JsonSetter("userName")
    @NotBlank(message = "Invalid email|Parameter email is required")
    private String userName;
    @NotBlank(message = "Invalid password|Parameter password is required")
    private String password;
    private String remember;
}
