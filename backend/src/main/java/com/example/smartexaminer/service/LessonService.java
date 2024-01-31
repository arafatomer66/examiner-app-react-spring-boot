package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.dto.page.LessonPageResponse;
import com.example.smartexaminer.model.entity.*;
import com.example.smartexaminer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LessonService {
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    TopicRepository topicRepository;
    @Autowired
    TableSequenceRepository tableSequenceRepository;

    public Lesson getLessonByIdRepository(Integer id) throws RuntimeException {
        return this.lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Lesson with id = " + id));
    }

    public Topic getTopicByIdRepository(Integer id) throws RuntimeException {
        return this.topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Topic with id = " + id));
    }

    public Subject getSubjectByIdRepository(Integer id) throws RuntimeException {
        return this.subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Subject with id = " + id));
    }

    public List<Subject> getAllSubjectListRepository(Integer examId, Integer teacherId) throws RuntimeException {
        return this.subjectRepository.findSubjectByExamIdAndTeacherId(examId, teacherId);
    }

    public int getTableSequenceId(){
        TableSequence _tableSequence = tableSequenceRepository.findOneByTableType("lesson");
        if (_tableSequence==null) {
            _tableSequence = TableSequence.builder()
                    .setSequence(1)
                    .setTableType("lesson")
                    .build();
        } else {
            _tableSequence.setSequence(_tableSequence.getSequence() + 1);
        }
        tableSequenceRepository.save(_tableSequence);
        return _tableSequence.getSequence();
    }

    public List<Lesson> getLessonListBySubjectIdRepository(Integer subjectId) throws RuntimeException {
        List<Lesson> lessonList;
        lessonList = this.lessonRepository.findBySubjectIdOrderByTopicIdAscSequenceAsc(subjectId);
        if (lessonList.isEmpty()){
            throw new RuntimeException("Not found|Lesson List empty!");
        }
        return lessonList;
    }

    public Lesson editLessonRepository(Lesson originalLesson, Lesson _lesson) {
        if (_lesson.getTopicId()==null || _lesson.getSubjectId()==null){
            throw new RuntimeException("Resource missing|Not given topic id or subject id");
        }
        Topic topic = this.getTopicByIdRepository(_lesson.getTopicId());
        Subject subject = this.getSubjectByIdRepository(_lesson.getSubjectId());
        originalLesson.setTopicName(topic.getTitle());
        originalLesson.setTopicId(topic.getId());
        originalLesson.setSubjectId(subject.getId());
        originalLesson.setSubjectName(subject.getTitle());
        originalLesson.setUrl(_lesson.getUrl());
        originalLesson.setTitle(_lesson.getTitle());
        originalLesson.setSequence(_lesson.getSequence());
        this.lessonRepository.save(originalLesson);
        return originalLesson;
    }

    public boolean deleteLessonByIdRepository(Integer id) {
        Lesson lesson = this.getLessonByIdRepository(id);
        this.lessonRepository.delete(lesson);
        return true;
    }

    public Lesson getLessonById(Integer id) {
        return this.getLessonByIdRepository(id);
    }

    @Transactional
    public Lesson editLesson(Integer id, Lesson editLessonDto) {
        Lesson lesson = this.getLessonByIdRepository(id);
        return this.editLessonRepository(lesson, editLessonDto);
    }

    public Lesson createLesson(CreateLessonDto createLessonDto) {
        Integer subjectId = createLessonDto.getSubjectId();
        Integer topicId = createLessonDto.getTopicId();
        if (subjectId==null|| topicId==null){
            throw new RuntimeException("Error|Teacher id and subject id can't be empty");
        }
        Subject subject =  this.getSubjectByIdRepository(subjectId);
        Topic topic = this.getTopicByIdRepository(topicId);
         Lesson lesson = Lesson.builder()
                .setTopicName(topic.getTitle())
                .setTopicId(topic.getId())
                .setSubjectId(subject.getId())
                .setSubjectName(subject.getTitle())
                .setUrl(createLessonDto.getUrl())
                .setTitle(createLessonDto.getTitle())
                .setSequence(this.getTableSequenceId())
                .build();
         this.lessonRepository.save(lesson);
        return lesson;
    }

    public boolean deleteLessonById(Integer lessonId) {
        return this.deleteLessonByIdRepository(lessonId);
    }

    public LessonPageResponse getAllLessonsFromQuery(
            GetLessonFromRequest request
    ) {
        Integer subjectId = request.getSubjectId();
        Integer examId = request.getExamId();

        if (subjectId==null){
            throw new RuntimeException("Error|Subject id can't be empty");
        }
        this.subjectRepository.findById(subjectId).orElseThrow(
                ()-> new RuntimeException("Not Found error|Can't find subject by id = "+ subjectId)
        );

        List<Lesson> lessonList = this.getLessonListBySubjectIdRepository(subjectId);
        System.out.print("\n" +lessonList+ "\n");
        Map<Integer, List<Lesson>> lessonMap = new HashMap<>();
        lessonList.forEach((Lesson lesson)->{
            Integer _topicId = lesson.getTopicId();
            System.out.print("\n" +_topicId+ "\n");
            if (_topicId != null) {
                if (lessonMap.containsKey(_topicId)) {
                    lessonMap.get(_topicId).add(lesson);
                } else {
                    List<Lesson> newList = new ArrayList<>();
                    newList.add(lesson);
                    lessonMap.put(_topicId, newList);
                }
            }
        });
        System.out.print("\n" + lessonMap+ "\n");
        List<Topic> topicList = topicRepository.findBySubjectIdInAndExamId(
                Set.of(subjectId),
                examId
        );
        return LessonPageResponse.builder()
                .setLessonMap(lessonMap)
                .setTopicMap(
                        topicList.stream()
                                .collect(Collectors.toMap(Topic::getId, lesson -> lesson))
                )
                .build();
    }


}
