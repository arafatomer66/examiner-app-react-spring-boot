package com.example.smartexaminer.model.dto;

import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

@Data
public class ChangePassDto {

    @NotBlank(message = "Invalid oldPassword|Parameter oldPassword is required")
    private String password;

}
