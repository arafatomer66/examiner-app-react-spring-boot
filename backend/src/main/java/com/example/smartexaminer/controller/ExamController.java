package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ExamModuleWithQuestions;
import com.example.smartexaminer.model.dto.GetQuestionFromQuestionString;
import com.example.smartexaminer.model.dto.page.QuestionPageResponse;
import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.*;
import com.example.smartexaminer.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/exam")
@CrossOrigin(origins = "*")
public class ExamController {
    @Autowired
    private ExamService examService;
    @Autowired
    private QuestionService questionService;

    @GetMapping(value ="/")
    public ResponseEntity<ResponseData> getAllExam() {
        List<Exam> examList = examService.getAllExamRepository();
        Map<String, Object> res = new HashMap<>();
        res.put("exam", examList);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }


    @GetMapping(value ="/module")
    public ResponseEntity<ResponseData> getAllExamModule(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "examId", required = true) Integer examId,
            @RequestParam(value = "teacherId", required = true) Integer teacherId
    ) {
        Map<String, Object> res = new HashMap<>();
        if (page == null && size == null){
            System.out.print("Hit");
            List<ExamModule> list = examService.getAllExamModule(examId, teacherId);
            res.put("list", list);
            ResponseData response = ResponseData.builder().
                    setCode(0)
                    .setData(res)
                    .setMessage("Success").build();
            return ResponseEntity.ok(response);
        }
        else {
            if (page == null){
                page = 0;
            }
            if (size == null){
                size =10;
            }
            Page<ExamModule> examPage = examService.getAllExamModule(page, size, examId, teacherId);
            List<ExamModule> list = examPage.getContent();
            res.put("list", list);
            res.put("currentPage", examPage.getNumber());
            res.put("totalItems", examPage.getTotalElements());
            res.put("totalPages", examPage.getTotalPages());
            res.put("page", page);
            res.put("size", size);
            ResponseData response = ResponseData.builder().
                    setCode(0)
                    .setData(res)
                    .setMessage("Success").build();
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping(value ="/subject/{id}/exam/{examId}/topic")
    public ResponseEntity<ResponseData> getAllTopicBySubjectIdAndExamId(
            @PathVariable("id") Integer subjectId, @PathVariable("examId") Integer examId
    ) {
        List<Topic> topicList = examService.findTopicBySubjectIdAndExamId(subjectId, examId);
        Map<String, Object> res = new HashMap<>();
        res.put("topic", topicList);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value ="/module/{id}")
    @Async
    public ResponseEntity<ResponseData> getExamModuleForExam(
            @PathVariable("id") Integer moduleId,
            @RequestParam(value = "isGetAnswers", defaultValue = "false") String isGetAnswerString
    ) {
    try {
        boolean isGetAnswers = isGetAnswerString != null && isGetAnswerString.equals("true");
        Map<String, Object> res = new HashMap<>();
        ExamModuleWithQuestions examModuleWithQuestions = examService.getModuleById(moduleId);
        res.put("module", examModuleWithQuestions.getModule());
        res.put("examId", examModuleWithQuestions.getExamId());
        List<Question> questionList = examModuleWithQuestions.getQuestionList();
        if (!isGetAnswers) {
            for (Question question : questionList) {
                question.setExplanation(null);
            }
        }
        res.put("questionList", questionList);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }
    catch (Exception error){
        return ResponseEntity.ok(ResponseData.builder().
                setCode(0)
                .setMessage("Success").build()
        );
    }
    }

    @DeleteMapping(value ="/module/{id}")
    public ResponseEntity<ResponseData> deleteExamModule(
            @PathVariable("id") Integer moduleId
    ) {
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", examService.deleteModuleById(moduleId));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PostMapping(value ="/question/module")
    public ResponseEntity<ResponseData> getAllExamModule(
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestBody GetQuestionFromQuestionString dto
            ) {
        if (page == null){
            page = 0;
        }
        if (size == null){
            size =10;
        }
        QuestionPageResponse questionPageResponse = questionService.getAllQuestionsFromQuestionIdString(
                page, size, dto
        );
        Page<Question> questionPage = questionPageResponse.getQuestionPage();
        Map<Integer, Subject> subjectHashMap = questionPageResponse.getSubjectMap();
        Map<Integer, Topic> topicHashMap = questionPageResponse.getTopicMap();
        List<Question> list = questionPage.getContent();
        Map<String, Object> res = new HashMap<>();
        System.out.printf("\n%d %d %s\n", page, size, dto.getQuestionString());
        res.put("questionList", list);
        res.put("subjectMap", subjectHashMap);
        res.put("topicMap", topicHashMap);
        res.put("currentPage", questionPage.getNumber());
        res.put("page", page);
        res.put("size", size);
//        res.put("isLast", examPa;
        res.put("totalItems", questionPage.getTotalElements());
        res.put("totalPages", questionPage.getTotalPages());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @GetMapping(value ="/{id}/teacher/{teacherId}/subject")
    public ResponseEntity<ResponseData> getAllSubjectByExamIdAndTeacherId(
            @PathVariable("id") Integer id, @PathVariable("teacherId") Integer teacherId
    ) {
        List<Subject> subject = examService.getAllSubjectByExamIdAndTeacherId(id, teacherId);
        Map<String, Object> res = new HashMap<>();
        res.put("subject", subject);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }


}
