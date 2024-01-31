package com.example.smartexaminer.model.dto.bulk;

import com.example.smartexaminer.model.enums.ExcelQuestionKey;
import com.example.smartexaminer.model.enums.QuestionType;
import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class ExcelModuleMapper {
    @ExcelRow
    private int rowIndex;
    @ExcelCellName("QuestionID")
    private String key;
    @ExcelCellName("Keywords")
    private String keywords;
    @ExcelCellName("Subject")
    private String subject;
    @ExcelCellName("Topic")
    private String topic;
    @ExcelCellName("Question Text")
    private String questionText;
    @ExcelCellName("Question Image URL")
    private String imageURL;
    @ExcelCellName("Difficulty")
    private String difficultyString;

    public List<String> getKeywordsList(){

        if (keywords==null) {
            return new ArrayList<>();
        }
        String keywordsString= keywords.trim();

        String[] parts = keywordsString.split(",");
        if (keywordsString.isEmpty()){
            this.setKeywords(null);
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(parts));
    }
    public int getDifficultyValue() {
        int value;
        if (difficultyString == null) return 1;
        String difficulty = difficultyString.toLowerCase().trim();
        switch (difficulty) {
            case "easy":
                value = 1;
                break;
            case "medium":
                value = 2;
                break;
            case "hard":
                value = 3;
                break;
            default:
                value = 1;
                break;
        }
        return value;
    }

    public QuestionType getQuestionType(){
        int count = 0;
        if (option1Image!= null || option1Value !=null) count++;
        if (option2Image!= null || option2Value !=null) count++;
        if (option3Image!= null || option3Value !=null) count++;
        if (option4Image!= null  || option4Value !=null) count++;
        if (option5Image!= null || option5Value !=null) count++;
        switch (count) {
            case 0:
                return QuestionType.QUESTION;
            case 2:
                return QuestionType.MCQ_2OPTIONS;
            case 3:
                return QuestionType.MCQ_3OPTIONS;
            case 4:
                return QuestionType.MCQ_4OPTIONS;
            case 5:
                return QuestionType.MCQ_5OPTIONS;
            default:
                return QuestionType.QUESTION;
        }
    }

    @ExcelCellName("Option A Value")
    private String option1Value;
    @ExcelCellName("Option A Image")
    private String option1Image;
    @ExcelCellName("Option B Value")
    private String option2Value;
    @ExcelCellName("Option B Image")
    private String option2Image;
    @ExcelCellName("Option C Value")
    private String option3Value;
    @ExcelCellName("Option C Image")
    private String option3Image;
    @ExcelCellName("Option D Value")
    private String option4Value;
    @ExcelCellName("Option D Image")
    private String option4Image;
    @ExcelCellName("Option E Value")
    private String option5Value;
    @ExcelCellName("Option E Image")
    private String option5Image;

    @ExcelCellName("Correct Answer")
    private String correctAnswer;
    @ExcelCellName("Explanation Text")
    private String explanationText;
    @ExcelCellName("Explanation Video URL")
    private String explanationVideoURL;
    @ExcelCellName("Explanation Image URL")
    private String explanationImageURL;



//    Subject	Topic	Question Text	Question Image URL	Difficulty	Option 1 Value	Option 1 Image	Option 2 Value	Option 2 Image	Option 3 Value	Option 3 Image	Option 4 Value	Option 4 Image	Option 5 Value	Option 5 Image Correct Answer Exaplanation Text	Explanation Video URL	Explanation Image URL

}
