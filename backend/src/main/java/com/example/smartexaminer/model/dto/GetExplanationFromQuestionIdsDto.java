package com.example.smartexaminer.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class GetExplanationFromQuestionIdsDto {
    List<Integer> ids;
}
