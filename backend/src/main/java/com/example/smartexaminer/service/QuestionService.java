package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.dto.page.QuestionPageResponse;
import com.example.smartexaminer.model.entity.*;
import com.example.smartexaminer.model.entity.user.Teacher;
import com.example.smartexaminer.model.enums.QuestionStatus;
import com.example.smartexaminer.repository.*;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuestionOptionsRepository questionOptionsRepository;
    @Autowired
    private ExplanationRepository explanationRepository;
    @Autowired
    private ExamModuleRepository moduleRepository;
    @Autowired
    private ExamRepository examRepository;
    @Autowired
    private  TeacherRepository teacherRepository;
    @Autowired
    private  SubjectRepository subjectRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private TableSequenceRepository tableSequenceRepository;

    public Question createQuestionRepository(
            Question questionBody,
            List<QuestionOptions> optionsList,
            Explanation explanation,
            Teacher teacher
            ) {
        Question question = new Question(questionBody);
        for (QuestionOptions questionOption : optionsList) {
            questionOption.setQuestion(question);
        }
        explanation.setQuestion(question);
        question.setOptions(optionsList);
        question.setTeacher(teacher);
        question.setExplanation(explanation);
        this.questionRepository.save(question);
        return question;
    }

    public Question getQuestionByIdRepository(Integer id) throws RuntimeException {
        return this.questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + id));
    }



    public List<Explanation> findExplanationByQuestionIdRepository(List<Integer> ids) {
        List<Explanation> explanationList = this.explanationRepository.findExplanationByQuestionIdIn(ids);
        for (Explanation explanation: explanationList){
            explanation.setQuestion_id(explanation.getQuestion().getId());
        }
        return  explanationList;
    }

    public Question editQuestionRepository(
            Question newQuestion,
            Question questionBody
    ) {
        Teacher teacher = null;
        if (questionBody.getTeacher()!=null){
            Integer teacherId = questionBody.getTeacher().getId();
            if (teacherId!=null){
                teacher = this.teacherRepository.findById(teacherId).orElseThrow(
                        ()-> new RuntimeException("Can't find by id = "+ teacherId)
                );
            }
        }
        Integer questionId = questionBody.getId();
        if (null==questionId){
            throw new RuntimeException("Unprocessable Entity|Question id cannot be null!");
        }
        questionBody.setDifficulty(questionBody.getDifficulty());
        newQuestion.setText(questionBody.getText());
        newQuestion.setImageUrl(questionBody.getImageUrl());
        newQuestion.setExam_id(questionBody.getExam_id());
        newQuestion.setStatus(questionBody.getQuestionStatus());
        newQuestion.setComment(questionBody.getComment());
        newQuestion.setReviewedAt(questionBody.getReviewedAt());
        newQuestion.setTeacher(teacher);
        newQuestion.setTopic_id(questionBody.getTopic_id());
        newQuestion.setSubject_id(questionBody.getSubject_id());
        this.questionRepository.save(newQuestion);
        return newQuestion;
    }

    public Question editQuestionStatusRepository(
            Integer questionId, QuestionStatus status, String comment
    ) {
        Question question = this.questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + questionId));
        question.setStatus(status);
        question.setComment(comment);
        this.questionRepository.save(question);
        return question;
    }

    public Explanation editExplanationRepository(Explanation body, Question question) {
        Integer explanationId = body.getId();
        Explanation explanation;
        if (null==explanationId){
            explanation = Explanation.builder().build();
            explanation.setQuestion(question);
        }
        else {
            explanation = this.explanationRepository.findById(body.getId())
                    .orElseThrow(() -> new RuntimeException("Resource missing|Not found Explanation with id = " + explanationId));
        }
        explanation.setText(body.getText());
        explanation.setCorrectAnswer(body.getCorrectAnswer());
        explanation.setVideoUrl(body.getVideoUrl());
        explanation.setImageUrl(body.getImageUrl());
        this.explanationRepository.save(explanation);
        return explanation;
    }


    public List<QuestionOptions> editQuestionOptionsRepository(List<QuestionOptions> newOptionsList, Question question) {
        List<QuestionOptions> oldList = questionOptionsRepository.findQuestionOptionsByQuestionIdOrderByKeyAsc(question.getId());
        List<QuestionOptions> newList = new ArrayList<>();
        Map<String, QuestionOptions> newMap = new HashMap<>();
        newOptionsList.forEach((QuestionOptions option)->{
            option.setQuestion(question);
            newMap.put(option.getKey(), option);
        });
        List<QuestionOptions> deleteList = new ArrayList<>();
        // delete old options (need a loop)
        // edit current options
        // add new options
        for (Iterator<QuestionOptions> iterator = oldList.iterator(); iterator.hasNext();) {
            QuestionOptions oldOption = iterator.next();
            if (newMap.containsKey(oldOption.getKey())) {
                QuestionOptions newMatchingOption = newMap.get(oldOption.getKey());
                oldOption.setValue(newMatchingOption.getValue());
                oldOption.setKey(newMatchingOption.getKey());
                oldOption.setImageUrl(newMatchingOption.getImageUrl());
                // remove key
                newMap.remove(oldOption.getKey());
            } else {
                deleteList.add(oldOption);
                iterator.remove();
            }
        }
        for (Map.Entry<String, QuestionOptions> newEntrySet: newMap.entrySet()){
            QuestionOptions questionOptions= newEntrySet.getValue();
            newList.add(questionOptions);
        }
        questionOptionsRepository.saveAll(newList);
        oldList.addAll(newList);
        oldList.sort(Comparator.comparing(QuestionOptions::getKey));
        questionOptionsRepository.saveAll(oldList);
        questionOptionsRepository.deleteAll(deleteList);
        return oldList;
    }

    public boolean deleteQuestionByIdRepository(Integer id) {
        Question question = this.questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + id));
        this.questionRepository.delete(question);
        return true;
    }

    public boolean deleteExplanationByIdRepository(Integer id) {
        Explanation explanation = this.explanationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Explanation with id = " + id));
        this.explanationRepository.delete(explanation);
        return true;
    }

    public boolean deleteOptionByIdRepository(Integer id) {
        QuestionOptions options = this.questionOptionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Options with id = " + id));
        this.questionOptionsRepository.delete(options);
        return true;
    }

    @Transactional
    public Question createQuestion(CreateQuestionDto createQuestionDto) {
        Teacher teacher = null;
        if (createQuestionDto.getQuestion().getTeacher()!=null){
            Integer teacherId = createQuestionDto.getQuestion().getTeacher().getId();
            if (teacherId!=null){
                teacher = this.teacherRepository.findById(teacherId).orElseThrow(
                        ()-> new RuntimeException("Can't find by id = "+ teacherId)
                );
            }
        }
        return this.createQuestionRepository(
                createQuestionDto.getQuestion(),
                createQuestionDto.getOptionList(),
                createQuestionDto.getExplanation(),
                teacher
                );
    }

    public Question getQuestionById(Integer id) {
        Question question = this.getQuestionByIdRepository(id);
        question.setExplanation(null);
        return question;
    }

    public  List<Explanation> getExplanationByQuestionIds(GetExplanationFromQuestionIdsDto explanationInQuestionIdsDto) {
        return this.findExplanationByQuestionIdRepository(
                explanationInQuestionIdsDto.getIds()
        );
    }

    public Question editQuestion(EditQuestionDto editQuestionDto) {
        Question question = this.questionRepository.findById(editQuestionDto.getQuestion().getId())
                .orElseThrow(() -> new RuntimeException("Resource missing|Not found Question with id = " + editQuestionDto.getQuestion().getId()));
        question = this.editQuestionRepository(
                question, editQuestionDto.getQuestion()
        );
        List<QuestionOptions> optionsList = this.editQuestionOptionsRepository(editQuestionDto.getOptionList(), question);
        Explanation explanation = this.editExplanationRepository(editQuestionDto.getExplanation(), question);
        question.setExplanation(explanation);
        question.setOptions(optionsList);
        return question;
    }

    @Transactional
    public Question editQuestionStatus(
            Integer questionId, EditQuestionStatusDto editQuestionStatusDto
    ) {
        return this.editQuestionStatusRepository(
                questionId, editQuestionStatusDto.getStatus(), editQuestionStatusDto.getComment()
        );
    }

    public boolean deleteQuestionById(Integer questionId, Integer moduleId) {
        ExamModule module = this.moduleRepository.findById(moduleId).orElseThrow(
                ()-> new RuntimeException("Can't find this module by id= "+ moduleId)
        );
        List<Integer> questionIdList = module.findQuestionsAsList();
        String questionString = module.storeQuestionsAsString(
                questionIdList.stream().filter((Integer newQuestionId)-> !questionId.equals(newQuestionId)).collect(Collectors.toList())
        );
        module.setQuestions(questionString);
        moduleRepository.save(module);
        return this.deleteQuestionByIdRepository(questionId);
    }

    public boolean deleteModuleById(Integer moduleId) {
        ExamModule module = this.moduleRepository.findById(moduleId).orElseThrow(
                ()-> new RuntimeException("Can't find this module by id= "+ moduleId)
        );
        List<Integer> questionIdList = module.findQuestionsAsList();
        List<Question> questionList = questionRepository.findAllById(questionIdList);
        questionRepository.deleteAll(questionList);
        moduleRepository.delete(module);
        return true;
    }

    public boolean deleteExplanationById(Integer id) {
        return this.deleteExplanationByIdRepository(id);
    }

    public boolean deleteOptionById(Integer id) {
        return this.deleteOptionByIdRepository(id);
    }

    public QuestionPageResponse getAllQuestionsFromQuestionIdString(
            Integer page,
            Integer size,
            GetQuestionFromQuestionString dto
    ) {
        String questionIdString = dto.getQuestionString();
        Integer examId = dto.getExamId();
        Integer teacherId = dto.getTeacherId();
        Pageable pageable = PageRequest.of(page, size);
        ExamModule examModule = new ExamModule();
        examModule.setQuestions(questionIdString);
        List<Integer> integerList = examModule.findQuestionsAsList();
        Page<Question> questionList =  questionRepository.findAllByIdInOrderBySequenceAsc(
                integerList, dto.getSubjectId(),
                dto.getTopicId(),  dto.getDifficulty(), dto.getQuestionStatus(),
                pageable
        );

        List<Subject> subjectList = subjectRepository.findSubjectByExamIdAndTeacherId(
                examId, teacherId
        );
        Set<Integer> subjecIdtList = subjectList.stream()
                .map(Subject::getId)
                .collect(Collectors.toSet());
        List<Topic> topicList = topicRepository.findBySubjectIdInAndExamId(
                subjecIdtList,
                examId
        );
        return QuestionPageResponse.builder()
                .setQuestionPage(questionList)
                .setTopicMap(
                        topicList.stream()
                                .collect(Collectors.toMap(Topic::getId, obj -> obj))
                )
                .setSubjectMap(
                        subjectList.stream()
                                .collect(Collectors.toMap(Subject::getId, obj -> obj))
                )
                .build();
    }

    public ExamModule editModuleAddNewQuestion(Integer moduleId, Integer questionId) {
        ExamModule module = moduleRepository.findById(moduleId).orElseThrow(
                ()-> new RuntimeException("Module is not found by id = " + moduleId)
        );
        List<Integer> moduleList =module.findQuestionsAsList();
        moduleList.add(questionId);
        module.setQuestions(module.storeQuestionsAsString(moduleList));
        moduleRepository.save(module);
        return module;
    }

    public ExamModule createModule(Integer teacherId, Integer examId) {
        Exam exam = examRepository.findById(examId).orElseThrow(
                ()-> new RuntimeException("Exam not found by id = "+ examId)
        );
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(
                ()-> new RuntimeException("Teacher not found by id = " + teacherId)
        );
        ExamModule examModule = ExamModule.builder()
                .setExam(exam)
                .setTeacher(teacher)
                .build();
        moduleRepository.save(examModule);
        return examModule;
    }
}
// explanation for all or just for wrong answers?