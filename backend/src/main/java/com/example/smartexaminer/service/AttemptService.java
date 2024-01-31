package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.ExamModuleWithQuestions;
import com.example.smartexaminer.model.dto.attempt.AttemptHistoryAndModuleWithQuestions;
import com.example.smartexaminer.model.entity.Question;
import com.example.smartexaminer.model.entity.test.AttemptHistory;
import com.example.smartexaminer.model.entity.ExamModule;
import com.example.smartexaminer.model.entity.test.AttemptResult;
import com.example.smartexaminer.model.enums.QuestionResultType;
import com.example.smartexaminer.repository.AttemptHistoryRepository;
import com.example.smartexaminer.utils.Common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AttemptService {
    @Autowired
    AttemptHistoryRepository attemptHistoryRepository;
    @Autowired
    ExamService examService;

    public AttemptHistory createHistory(Integer moduleId,
                                        HashMap<Integer, String> attemptList, Integer userId
    ) {
//        try {
            ExamModuleWithQuestions module = examService.getModuleById(moduleId);
            ExamModule examModule = module.getModule();
            List<Question> questionList = module.getQuestionList();
            System.out.printf("\nid=%s\n", module);
            System.out.printf("\nid=%s\n", attemptList);
            int totalQuestion = 0;
            int totalAnswerMissing = 0;
            int totalAnswerBlank = 0;
            int totalCorrect = 0;
            Double percentage = 0.0;
            LocalDateTime startDate = LocalDateTime.now();
            LocalDateTime endDate = LocalDateTime.now();
            int minutes = examModule.getTimeInMinutes() != null ? examModule.getTimeInMinutes() : 60;
            startDate = endDate.minusMinutes(minutes);
            Map<Integer, AttemptResult> attemptResultMap = new HashMap<>();
            for (Question question: questionList) {
                Integer questionId = question.getId();
                totalQuestion+=1;
                System.out.printf("\nid=%s\n", questionId);
                String answerSubmission = attemptList.getOrDefault(questionId, "N/A");
                QuestionResultType questionResultType;
                System.out.printf("\nanswer=%s\n", answerSubmission);
                if (question.getExplanation() ==null || question.getExplanation().getCorrectAnswer()==null) {
                    questionResultType = QuestionResultType.EXAMINER_NO_ANSWER;
                    totalAnswerMissing+=1;
                }
                else {
                    questionResultType = Objects.equals(answerSubmission, "N/A")
                            ? QuestionResultType.STUDENT_NO_ANSWER : null;
                    if (questionResultType == null) {
                        questionResultType = Objects.equals(question.getExplanation().getCorrectAnswer(), answerSubmission) ?
                                QuestionResultType.CORRECT : QuestionResultType.WRONG;
                    }else{
                        totalAnswerBlank+=1;
                    }
                    if (questionResultType == QuestionResultType.CORRECT){
                        totalCorrect+=1;
                    }
                }
                attemptResultMap.put(questionId, new AttemptResult(
                        questionResultType, answerSubmission
                ));
            }
        System.out.printf("\nid=%s\n", attemptResultMap);
        if ((totalQuestion- totalAnswerMissing) > 0) {
            percentage = (double) (totalCorrect / (totalQuestion- totalAnswerMissing));
        }
        else{
            percentage = 100.0;
        }
        AttemptHistory attemptHistory = AttemptHistory.builder()
                    .setModuleId(moduleId)
                    .setResult(attemptResultMap)
                    .setStartDateTime(startDate)
                    .setUserId(userId)
                    .setPercentage(percentage)
                    .setTotalAnswerMissing(totalAnswerMissing)
                    .setTotalCorrect(totalCorrect)
                    .setTotalQuestion(totalQuestion)
                    .setTotalBlank(totalAnswerBlank)
                    .setEndDateTime(endDate)
                    .build();
            attemptHistoryRepository.save(attemptHistory);
            return attemptHistory;
//        }
//        catch(Exception error){
//               System.out.println(error.getMessage());
//               return null;
//        }

    }

    public List<AttemptHistory> getModulesAttemptFromUser(){
        try{
            Integer userId = Common.getCurrentId();
            return attemptHistoryRepository.findByUserId(userId);
        }
        catch(Exception error){
            System.out.print(error.getMessage());
            return null;
        }
    }

    public AttemptHistoryAndModuleWithQuestions getModulesAttemptById(Integer id) {
        try {
            AttemptHistory attemptHistory = attemptHistoryRepository.findById(id).orElse(null);
            if (attemptHistory != null && attemptHistory.getModuleId() != null) {
                ExamModuleWithQuestions module = examService.getModuleById(attemptHistory.getModuleId());
                AttemptHistoryAndModuleWithQuestions output = new AttemptHistoryAndModuleWithQuestions();
                output.setAttemptHistory(attemptHistory);
                output.setExamModuleWithQuestions(module);
                return output;
            } else {
                throw new RuntimeException("Not found|Attempt history or exam information is invalid");
            }
        } catch (Exception error) {
            System.out.print(error.getMessage());
            return null;
        }
    }

    public AttemptHistoryAndModuleWithQuestions getModulesAttemptByIdNoCheck(Integer id) {
        try {
            AttemptHistory attemptHistory = attemptHistoryRepository.findById(id).orElse(null);
            if (attemptHistory != null && attemptHistory.getModuleId() != null) {
                ExamModuleWithQuestions module = examService.getModuleByIdNoSubscriptionCheck(attemptHistory.getModuleId());
                AttemptHistoryAndModuleWithQuestions output = new AttemptHistoryAndModuleWithQuestions();
                output.setAttemptHistory(attemptHistory);
                output.setExamModuleWithQuestions(module);
                return output;
            } else {
                throw new RuntimeException("Not found|Attempt history or exam information is invalid");
            }
        } catch (Exception error) {
            System.out.print(error.getMessage());
            return null;
        }
    }

}
