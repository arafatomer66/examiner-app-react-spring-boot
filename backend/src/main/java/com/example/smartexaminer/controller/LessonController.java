package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.dto.page.LessonPageResponse;
import com.example.smartexaminer.model.entity.Lesson;
import com.example.smartexaminer.service.LessonService;
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
@RequestMapping(value = "/api/v1/lesson")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
public class LessonController {

    @Autowired
    LessonService lessonService;

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('STUDENT') or hasAuthority('PARENT') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value ="/")
    @Transactional
    public ResponseEntity<ResponseData> getLesson(
            @Valid @RequestBody GetLessonFromRequest getLessonFromRequest
    ) {
        LessonPageResponse lesson = lessonService.getAllLessonsFromQuery(getLessonFromRequest);
        Map<String, Object> res = new HashMap<>();
        res.put("topicMap", lesson.getTopicMap());
        res.put("list", lesson.getLessonMap());
        ResponseData response= ResponseData.builder().setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PutMapping(value ="/{id}")
    public ResponseEntity<ResponseData> editLesson(
            @PathVariable("id") Integer id,
            @Valid @RequestBody Lesson editLessonDto
    ) {
        Lesson lesson = lessonService.editLesson(id, editLessonDto);
        Map<String, Object> res = new HashMap<>();
        res.put("lesson", lesson);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @DeleteMapping(value ="/{id}")
    public ResponseEntity<ResponseData> deleteLessonById(
            @PathVariable("id") Integer id
    ){
        Map<String, Object> res = new HashMap<>();
        res.put("isDeleted", lessonService.deleteLessonById(id));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @GetMapping(value ="/{id}")
    public ResponseEntity<ResponseData> getLessonById(@PathVariable("id") Integer id) {
        Lesson lesson = lessonService.getLessonById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("lesson", lesson);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }


    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value ="/create")
    @Transactional
    public ResponseEntity<ResponseData> createLesson(
            @Valid @RequestBody CreateLessonDto createLessonDto
    ) {
        Lesson lesson = lessonService.createLesson(createLessonDto);

        Map<String, Object> res = new HashMap<>();
        res.put("lesson", lesson);
        ResponseData response= ResponseData.builder().setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    }
