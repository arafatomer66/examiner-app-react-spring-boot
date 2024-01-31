package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.ExamModuleWithQuestions;
import com.example.smartexaminer.model.entity.*;
import com.example.smartexaminer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
public class ExamService {
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private ExamModuleRepository moduleRepository;

    @Autowired
    UserService userService;

    @Autowired
    SubscriptionPlansService subscriptionService;

    @Autowired
    SubscriptionUserDataService usersSubscriptionService;

    public Exam getExamByIdRepository(Integer id) {
        return this.examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + id));
    }

    public Exam getExamByTeacherIdRepository(Integer id) {
        return this.examRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + id));
    }

    public List<Subject> getAllSubjectByExamIdAndTeacherIdRepository(Integer id, Integer teacherId) {
        List<Subject> subjectList = this.subjectRepository.findSubjectByExamIdAndTeacherId(id, teacherId);
        if (subjectList.isEmpty()){
            throw new RuntimeException("Resource missing|Not found Question with id = " +
                    id + " teacherId = "+ teacherId);
        }
        return subjectList;
    }

    public List<Topic> findTopicBySubjectIdAndExamIdRepository(Integer id, Integer examId) {
        List<Topic> topicList = this.topicRepository.findBySubjectIdAndExamId(id, examId);
        if (topicList.isEmpty()){
            throw new RuntimeException("Resource missing|Not found Question with id = " +
                    id + " examId = "+ examId);
        }
        return topicList;
    }

    public List<Exam> getAllExamRepository() {
        List<Exam> examList = this.examRepository.findAll();
        if (examList.isEmpty()){
            throw new RuntimeException("Resource missing|Not found any exams");
        }
        return examList;
    }

    public Exam getExamById(Integer id) {
        return this.getExamByIdRepository(id);
    }

    public List<Exam> getAllExam() {
        return this.getAllExamRepository();
    }

    public Page<ExamModule> findAllByExamIdAndTeacherIdRepository(Pageable pageable,  int examId, int teacherId) {
        return this.moduleRepository.findAllByExamIdAndTeacherIdOrderByIdDesc(examId, teacherId, pageable);
    }

    public List<ExamModule> findAllByExamIdAndTeacherIdRepository(int examId, int teacherId) {
        return this.moduleRepository.findAllByExamIdAndTeacherIdOrderByIdDesc(examId, teacherId);
    }

    public Page<ExamModule> getAllExamModule(int page, int size, int examId, int teacherId) {
        Pageable pageable = PageRequest.of(page, size);
        return this.findAllByExamIdAndTeacherIdRepository(pageable, examId, teacherId);
    }

    public List<ExamModule> getAllExamModule(int examId, int teacherId) {
        return this.findAllByExamIdAndTeacherIdRepository( examId, teacherId);
    }


    public List<Subject> getAllSubjectByExamIdAndTeacherId(Integer id, Integer teacherId) {
        return this.getAllSubjectByExamIdAndTeacherIdRepository(id, teacherId);
    }

    public List<Topic> findTopicBySubjectIdAndExamId(Integer id, Integer teacherId) {
        return this.findTopicBySubjectIdAndExamIdRepository(id, teacherId);
    }


    @Transactional
    public boolean deleteModuleById(Integer moduleId) {
        ExamModule module= this.moduleRepository
                .findById(moduleId)
                .orElseThrow(()-> new RuntimeException("Module not found by id"));
        List<Question> questionList = this.questionRepository.findAllByIdInOrderBySequenceAsc(
                module.findQuestionsAsList()
        );
        this.questionRepository.deleteAll(questionList);
        this.moduleRepository.delete(module);
        return true;
    }

//    @Transactional
    public ExamModuleWithQuestions getModuleByIdNoSubscriptionCheck(Integer moduleId) {
        try {
            ExamModule module = this.moduleRepository
                    .findById(moduleId)
                    .orElseThrow(() -> new RuntimeException("Module not found by id"));
            List<Question> questionList = this.questionRepository.findAllByIdInOrderBySequenceAsc(
                    module.findQuestionsAsList()
            );
            System.out.println(questionList);

            return new ExamModuleWithQuestions(
                    module, module.getExam().getId(), questionList
            );
        }
        catch (Exception error){
            System.out.println("Error occurred");
            return null;
        }
    }

    public ExamModuleWithQuestions getModuleById(Integer moduleId) {
        try {
            User user = userService.getUser();
            SubscriptionUserData usersSubscription = usersSubscriptionService.findLatestActiveUsersSubscriptionByUserId(user.getId());
            SubscriptionPlans subscriptionActivePlan = null;
            if (usersSubscription != null) {
                subscriptionActivePlan = subscriptionService.getSubscriptionById(usersSubscription.getSubscriptionPlanId());
            }
            else{
                throw new RuntimeException("Unauthorized error|Cannot find any plan!");
            }
            Date newDate = new Date();
            if (usersSubscription.getSubscriptionEndDate()!=null ){
                if (usersSubscription.getSubscriptionEndDate().before(newDate)){
                usersSubscription.setActive(false);
                throw new RuntimeException("Unauthorized error|Plan has expired!");
            }}
            if (!subscriptionActivePlan.getExamList().contains(moduleId)) {
                throw new RuntimeException("Unauthorized error|Plan doesn't contain this exam!");
            }
            ExamModule module = this.moduleRepository
                    .findById(moduleId)
                    .orElseThrow(() -> new RuntimeException("Module not found by id"));
            List<Question> questionList = this.questionRepository.findAllByIdInOrderBySequenceAsc(
                    module.findQuestionsAsList()
            );
            System.out.println(questionList);

            return new ExamModuleWithQuestions(
                    module, module.getExam().getId(), questionList
            );
        }
        catch (Exception error){
            System.out.println("Error occurred");
            return null;
        }
    }
}

