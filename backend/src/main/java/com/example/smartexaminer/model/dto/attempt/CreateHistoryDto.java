package com.example.smartexaminer.model.dto.attempt;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.google.api.client.util.DateTime;
import lombok.Data;

import java.util.Date;
import java.util.HashMap;

@Data
public class CreateHistoryDto {
    @JsonSetter("moduleId")
    private Integer moduleId;

    @JsonSetter("userId")
    private Integer userId;

    @JsonSetter("attempt")
    private HashMap<Integer, String> attempt;
}
