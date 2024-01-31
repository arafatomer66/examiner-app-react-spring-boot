package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.entity.ExamModule;
import com.example.smartexaminer.model.entity.Explanation;
import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.service.ExamService;
import com.example.smartexaminer.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value ="/module")
    @Transactional
    public ResponseEntity<ResponseData> createModule(
            @RequestParam(value = "teacherId", required = false) Integer teacherId,
            @RequestParam(value = "examId", required = false) Integer examId
    ) {
        ExamModule module= questionService.createModule(
                teacherId,
                examId
        );
        Map<String, Object> res = new HashMap<>();
        res.put("module", module);
        ResponseData response= ResponseData.builder().setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value ="/question")
    @Transactional
    public ResponseEntity<ResponseData> createQuestion(
            @Valid @RequestBody CreateQuestionDto createQuestionDto,
            @RequestParam(value = "module_id", required = false) Integer moduleId
    ) {
        System.out.printf("\nmoduleId: %d\n", moduleId);
        Question question = questionService.createQuestion(createQuestionDto);
        ExamModule module = questionService.editModuleAddNewQuestion(
                moduleId,
                question.getId()
        );
        Map<String, Object> res = new HashMap<>();
        res.put("question", question);
        res.put("module", module);
        ResponseData response= ResponseData.builder().setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('TEACHER')")
    @GetMapping(value ="/question/{id}")
    public ResponseEntity<ResponseData> getQuestionById(@PathVariable("id") Integer id) {
        Question question = questionService.getQuestionById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("question", question);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PostMapping(value ="/question/explanation/")
    public ResponseEntity<ResponseData> getExplanationById(
            @Valid @RequestBody GetExplanationFromQuestionIdsDto explantionInQuestionIdsDto
    ) {
        List<Explanation> explanationList = questionService.getExplanationByQuestionIds(explantionInQuestionIdsDto);
        Map<String, Object> res = new HashMap<>();
        res.put("explanation", explanationList);
        ResponseData response =   ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PutMapping(value ="/question")
    public ResponseEntity<ResponseData> editQuestion(
            @Valid @RequestBody EditQuestionDto editQuestionDto
    ) {
        Question question = questionService.editQuestion(editQuestionDto);
        Map<String, Object> res = new HashMap<>();
        res.put("question", question);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PatchMapping(value ="/question/{id}/status")
    public ResponseEntity<ResponseData> editQuestionStatus(
            @PathVariable("id") Integer id,
            @Valid @RequestBody EditQuestionStatusDto editQuestionStatusDto
    ) {
        System.out.print("Hit here");
        Question question = questionService.editQuestionStatus(id, editQuestionStatusDto);
        Map<String, Object> res = new HashMap<>();
        res.put("question", question);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value ="/question/{id}/module/{moduleId}")
    public ResponseEntity<ResponseData> deleteQuestionById(
            @PathVariable("id") Integer id,
            @PathVariable("moduleId") Integer moduleId
    ) {
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", questionService.deleteQuestionById(id, moduleId));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value ="/question/explanation/{id}")
    public ResponseEntity<ResponseData> deleteExplanationById(@PathVariable("id") Integer id) {
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", questionService.deleteExplanationById(id));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value ="/question/options/{id}")
    public ResponseEntity<ResponseData> deleteOptionById(@PathVariable("id") Integer id) {
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", questionService.deleteOptionById(id));
        ResponseData response =  ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping(value ="/module/{id}")
    public ResponseEntity<ResponseData> deleteModuleById(@PathVariable("id") Integer id) {
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", questionService.deleteModuleById(id));
        ResponseData response =  ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }




}
