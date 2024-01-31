package com.example.smartexaminer.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


@Data
@AllArgsConstructor
@Builder(setterPrefix = "set")
public class ResponseData {
    private String message;
    private String description;
    private int code;
    private Object data;

    public ResponseData(){
        this.code = 1;
    }

    public ResponseData(String text){
        String[] msg = text.split("\\|");
        this.message = msg[0];
        this.description = msg.length > 1 ? msg[1] : msg[0];
        this.code = 1;
    }
}
