package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.dto.attempt.AttemptHistoryAndModuleWithQuestions;
import com.example.smartexaminer.model.dto.attempt.CreateHistoryDto;
import com.example.smartexaminer.model.entity.test.AttemptHistory;
import com.example.smartexaminer.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/history")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
public class AttemptController {

    @Autowired
    private AttemptService attemptService;

    @GetMapping(value ="/")
    public ResponseEntity<ResponseData> getByUserId() {
        List<AttemptHistory> attemptHistory = attemptService.getModulesAttemptFromUser();
        Map<String, Object> res = new HashMap<>();
        res.put("attemptHistory", attemptHistory);
        ResponseData response = ResponseData.builder()
                .setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('STUDENT')")
    @PostMapping(value ="/")
    public ResponseEntity<ResponseData> createHistory(@RequestBody @Valid CreateHistoryDto dto) {
        AttemptHistory attemptHistory = attemptService.createHistory(
                dto.getModuleId(),
                dto.getAttempt(),
                dto.getUserId()
        );
        Map<String, Object> res = new HashMap<>();
        res.put("attemptHistory", attemptHistory);
        ResponseData response = ResponseData.builder()
                .setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }
    @GetMapping(value ="/{id}")
    public ResponseEntity<ResponseData> getById(@PathVariable("id") Integer id) {
        AttemptHistoryAndModuleWithQuestions attemptHistoryAndModuleWithQuestions =
                attemptService.getModulesAttemptById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("attemptHistory", attemptHistoryAndModuleWithQuestions.getAttemptHistory());
        res.put("module", attemptHistoryAndModuleWithQuestions.getExamModuleWithQuestions() );
        ResponseData response = ResponseData.builder()
                .setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }




}
