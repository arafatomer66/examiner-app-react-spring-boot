package com.example.smartexaminer.model.dto.bulk;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BulkCreateModuleDto {
    String fileName;
    Integer examId;
    Integer teacherId;
    Map<String, String> uploadResults;
}
