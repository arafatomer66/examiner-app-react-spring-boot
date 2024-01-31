package com.example.smartexaminer.service;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.dto.bulk.BulkCreateLessonResponse;
import com.example.smartexaminer.model.dto.bulk.BulkCreateModuleResponse;
import com.example.smartexaminer.model.dto.bulk.ExcelLessonMapper;
import com.example.smartexaminer.model.dto.bulk.ExcelModuleMapper;
import com.example.smartexaminer.model.entity.*;
import com.example.smartexaminer.model.entity.user.Teacher;
import com.example.smartexaminer.model.enums.ExcelQuestionKey;
import com.example.smartexaminer.model.enums.QuestionStatus;
import com.example.smartexaminer.repository.*;
import com.example.smartexaminer.utils.Constants;
import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;


import com.poiji.bind.Poiji;
import com.poiji.exception.PoijiExcelType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import javax.transaction.Transactional;


import static com.example.smartexaminer.utils.Common.returnNullIfEmpty;

@Service
public class GoogleDriveService {

    @Value("${drive.applicationName}")
    private  String APPLICATION_NAME;
    private  final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    @Value("${drive.tokenPath}")
    private  String TOKENS_DIRECTORY_PATH;
    private  final List<String> SCOPES =
            Collections.singletonList(DriveScopes.DRIVE);

    private  final String CREDENTIALS_FILE_PATH = "/credentials.json";
    private  GoogleClientSecrets clientSecrets;
    private  GoogleAuthorizationCodeFlow flow;

    @Value("${drive.redirectUrl}")
    private  String driveRedirectUrl ;

    @Value("${server.directoryPath}")
    private  String directoryPath;

    private  NetHttpTransport HTTP_TRANSPORT;

     {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        } catch (GeneralSecurityException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenRepository tokenRepository;
    @Autowired
    TopicRepository topicRepository;
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    QuestionRepository questionRepository;
    @Autowired
    ExplanationRepository explanationRepository;
    @Autowired
    QuestionOptionsRepository optionsRepository;
    @Autowired
    TeacherRepository teacherRepository;
    @Autowired
    ExamModuleRepository examModuleRepository;
    @Autowired
    BlobService blobService;
    @Autowired
    ExamRepository examRepository;
    @Autowired
    LessonRepository lessonRepository;
    @Autowired
    TableSequenceRepository tableSequenceRepository;

    @PostConstruct
    private void postConstruct() throws IOException {
        loadGoogleClientSecrets();

        flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIRECTORY_PATH)))
                .setAccessType("offline")
                .build();
    }

    private  void loadGoogleClientSecrets() {
        try {
            // Load client secrets.
            InputStream in = GoogleDriveService.class.getResourceAsStream(CREDENTIALS_FILE_PATH);

            if (in == null) {
                throw new FileNotFoundException("Resource not found: " + CREDENTIALS_FILE_PATH);
            }
            clientSecrets =
                    GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));
        } catch (Exception exception) {
            System.out.print(exception.getMessage());
        }

    }

    public  String getCredentialsURL() throws GeneralSecurityException, IOException {

        try {
            System.out.print("\n called authorizationUrl \n");
            System.out.printf("\n %s %s\n", flow, driveRedirectUrl);
            // Build flow and trigger user authorization request.
            AuthorizationCodeRequestUrl authorizationUrl = flow.newAuthorizationUrl().setRedirectUri(
                    driveRedirectUrl
            );
            System.out.printf("\n cal authorizationUrl: %s, access: %s", authorizationUrl, flow.getAccessType());
            return authorizationUrl.build();

        } catch (Exception exception) {
            System.out.print(exception.getMessage());
            throw new RuntimeException(exception.toString());
        }
    }

    public Credential oauth2Callback(
            String username,
            String code
    ) throws GeneralSecurityException, IOException {
        TokenResponse response = flow.newTokenRequest(code).setRedirectUri(driveRedirectUrl).execute();
        return flow.createAndStoreCredential(response, username);
    }

    public boolean saveUserCredsInDatabase(String username, String accessToken, String refreshToken) {
        User user = userRepository.findUserByUsername(username).orElseThrow(
                NoSuchElementException::new
        );
        System.out.printf("\n%s: Hit username \n", user.getUsername());
        UserToken userToken = user.getUserTokens();
        if (userToken == null) {
            userToken = new UserToken();
        }
        System.out.printf("\n %s \n", userToken.getId());
        userToken.setGapiAccessToken(accessToken);
        userToken.setGapiRefreshToken(refreshToken);
        tokenRepository.save(userToken);
        user.setUserTokens(userToken);
        userRepository.save(user);
        System.out.printf("\n %s \n", userToken.getId());
        return true;
    }

    public Drive getInstance(String username) throws GeneralSecurityException, IOException {
        try {
            User user = userRepository.findUserByUsername(username).orElseThrow(
                    NoSuchElementException::new
            );
            UserToken userToken = user.getUserTokens();
            if (userToken == null || userToken.getId() == null) {
                throw new RuntimeException("Invalid Google Token|Token doesn't exisit! Sign in first.");
            }
            System.out.printf("\n %s %s \n", username, userToken.getGapiAccessToken());
            Credential credential = flow.loadCredential(username);
            System.out.printf("\n LOADED ACCESS TOKEN %s %s %s\n", credential.getAccessToken(), credential.getRefreshToken(), credential.getClientAuthentication());
            return new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        } catch (Exception exception) {
            System.out.print(exception.getMessage());
            throw new RuntimeException(exception.toString());
        }
    }


    public List<File> findAllFilesByFolder(
            String folderName,
            String extensionType,
            String username
    ) throws IOException, GeneralSecurityException {
        Drive service = getInstance(username);
//        String pageToken = null;
        String folderId = null;
        FileList result = service.files().list()
                .setQ(String.format("mimeType = 'application/vnd.google-apps.folder' and name = '%s'  and trashed = false", folderName))
                .setPageSize(10)
//                .setSpaces("drive")
//                .setFields("nextPageToken, items(id, title)")
//                .setPageToken(pageToken)
                .execute();
        if (result.getFiles().isEmpty()) {
            throw new RuntimeException("Folder can't be found by this name!");
        } else {
            folderId = result.getFiles().get(0).getId();
            System.out.print("\n" + folderName + " " + folderId + "\n");
        }
        System.out.printf("\n%s\n", extensionType);
        FileList fileResult = service.files().list()
                .setQ(String.format("'%s' in parents and mimeType ='%s' and trashed = false", folderId, extensionType))
                .setPageSize(10)
                .execute();
        List<File> files = fileResult.getFiles();
        if (files == null || files.isEmpty()) {
            throw new RuntimeException("File can't be found!");
        } else {
            return files;
        }
    }

    public List<File> getFiles(String username) throws IOException, GeneralSecurityException {
        Drive service = getInstance(username);
        FileList result = service.files().list()
                .setPageSize(10)
                .execute();
        return result.getFiles();
    }

    public List<File> findAllFilesInFolderById(String folderId, String email, String fileType) {
        try {
            folderId = folderId == null ? "root" : folderId;
            String query = String.format("'%s' in parents and mimeType contains '%s/' and trashed = false", folderId, fileType);
            Drive service = getInstance(email);

            FileList result = service
                    .files()
                    .list()
                    .setQ(query)
                    .setPageSize(10)
                    .setFields("nextPageToken, files(id, name, size, thumbnailLink, shared)")
                    .execute();
            return result.getFiles();
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        }
    }
//"1gCnoWoCFo6xUmZO3cs6TJE0Mrl-OfMkX"
//    public List<String> getFileParentName(String username, String fileId, Drive service) throws GeneralSecurityException, IOException {
//        Drive.Files.Get get = service.files().get(fileId);
//        File file = get.execute();
//        List<String> parents = file.getParents();
//        System.out.print(parents);
//        return parents;
//    }

    public String sendMediaAndDownloadAsBase64Encoded(String username, String fileId) {
        try {
            Drive service = getInstance(username);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            service.files().get(fileId).executeMediaAndDownloadTo(outputStream);

            // Convert the ByteArrayOutputStream to a byte array
            byte[] byteArray = outputStream.toByteArray();

            // Encode the byte array to Base64
            return Base64.getEncoder().encodeToString(byteArray);
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        }
    }

    public DownloadFileBackendResponse downloadFileBackend(String username, String fileId) throws GeneralSecurityException, IOException {
        return this.downloadFileBackend(username, fileId, null);
    }

    public DownloadFileBackendResponse downloadFileBackend(String username, String fileId, Drive service) {
        FileOutputStream fileOutputStream = null;
        try {
            if (service == null) service = getInstance(username);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Drive.Files.Get get = service.files().get(fileId);
            get.executeMediaAndDownloadTo(outputStream);
            get.setFields("parents,name");
            File file = get.execute();
            System.out.print("\n"+ file);
            // Convert the ByteArrayOutputStream to a byte array
            byte[] byteArray = outputStream.toByteArray();
            // Create the file path
            String filePath = String.format("%s/%s", directoryPath, file.getName());

            // Create a FileOutputStream to write the byte array to the file
            fileOutputStream = new FileOutputStream(filePath);
            fileOutputStream.write(byteArray);
            fileOutputStream.close();
            System.out.print("\n"+ file);
//            List<String> parentList = this.getFileParentName(username, file.getName(), service);
            return DownloadFileBackendResponse.builder()
                    .setIsDownloaded(true)
                    .setFile(file)
                    .build();
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        } finally {
            if (fileOutputStream != null) {
                try {
                    fileOutputStream.close();
                } catch (IOException e) {
                    // Handle exceptions
                }
            }
        }
    }

    public void deleteFileInMainResources(String fileName) {
        String filePath = String.format("%s/%s", directoryPath, fileName);
        Path path = Paths.get(filePath);
        try {
            Files.delete(path);
            System.out.println("File deleted successfully.");
        } catch (IOException e) {
            System.out.println("Failed to delete the file: " + e.getMessage());
        }
    }


    public DownloadFileAzureResponse saveFileToAzure(String username, String fileId) throws GeneralSecurityException, IOException {
        return this.saveFileToAzure(username, fileId, null);
    }

    public synchronized DownloadFileAzureResponse saveFileToAzure(String username, String fileId, Drive service) {
        try {
            if (service == null) service = getInstance(username);
            Drive.Files.Get get = service.files().get(fileId);
            File file = get.execute();
            InputStream inputStream = get.executeMediaAsInputStream();

            // Convert the ByteArrayOutputStream to a byte array
            byte[] byteArray = inputStream.readAllBytes();
            String fileName = file.getName();
            String fileUrl = blobService.uploadFileFromByteArray(fileName, byteArray);
            inputStream.close();
            return DownloadFileAzureResponse.builder()
                    .setIsDownloaded(true)
                    .setBlobFileName(fileUrl)
                    .setDriveFileName(fileName)
                    .build();
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] sendFileToFrontend(String username, String fileId) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Drive service = getInstance(username);
            Drive.Files.Get get = service.files().get(fileId);
            get.executeMediaAndDownloadTo(outputStream);

            // Convert the ByteArrayOutputStream to a byte array
            return outputStream.toByteArray();
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public BulkCreateModuleResponse importModuleFromExcelV2(
            Integer examId, Integer teacherId, String filename
    ) throws IOException {
        return importModuleFromExcelV2(examId, teacherId, filename, null);
    }

    //    @Transactional
    public BulkCreateModuleResponse importModuleFromExcelV2(
            Integer examId, Integer teacherId, String filename, Map<String, String> blobUrlToFileUrlMap
    ) throws IOException {
        BulkCreateModuleResponse bulkCreateModuleModuleResponse = new BulkCreateModuleResponse();
        InputStream stream = new FileInputStream(directoryPath + "/"+ filename);
        Optional<Teacher> _teacher = teacherRepository.findById(teacherId);
        if (_teacher.isEmpty()) {
            throw new RuntimeException("Teacher Not Found Error|Teacher is not found");
        }
        Optional<Exam> _exam = examRepository.findById(examId);
        if (_exam.isEmpty()) {
            throw new RuntimeException("Exam Not Found Error|Exam is not found");
        }
        List<ExcelModuleMapper> excelList = Poiji.fromExcel(stream, PoijiExcelType.XLSX, ExcelModuleMapper.class);
        Set<String> topicSet = new HashSet<>();
        Set<String> subjectSet = new HashSet<>();
        ArrayList<Question> questionList = new ArrayList<>();
        List<Explanation> explanationList = new ArrayList<>();
        List<QuestionOptions> optionsList = new ArrayList<>();
        Integer questionSequence = 0;
        for (ExcelModuleMapper excelItem : excelList) {
            topicSet.add(excelItem.getTopic().trim().toUpperCase());
            subjectSet.add(excelItem.getSubject().trim().toUpperCase());
            Explanation explanation;

            String questionImageUrlExcelValue = excelItem.getImageURL();
            questionImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    questionImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(questionImageUrlExcelValue, null);
            Question question = Question.builder()
                    .setText(excelItem.getQuestionText())
                    .setImageUrl(questionImageUrlExcelValue)
                    .setSequence(excelItem.getRowIndex())
                    .setSubjectName(excelItem.getSubject().trim().toLowerCase())
                    .setTopicName(excelItem.getTopic().trim().toLowerCase())
                    .setType(excelItem.getQuestionType())
                    .setDifficulty(excelItem.getDifficultyValue())
                    .setExam_id(examId)
                    .setTeacher(_teacher.get())
                    .setQuestionStatus(QuestionStatus.CREATED)
                    .build();
            questionSequence = excelItem.getRowIndex();
            if (excelItem.getKey() !=null && !excelItem.getKey().trim().isEmpty()){
                question.setKey(excelItem.getKey().trim());
            }
            question.setTagList(excelItem.getKeywordsList());
            String videoUrl = returnNullIfEmpty (excelItem.getExplanationVideoURL());
            String correctAnswer = returnNullIfEmpty(excelItem.getCorrectAnswer());
            String explanationText = returnNullIfEmpty(excelItem.getExplanationText());
            String explanationImageUrl = returnNullIfEmpty(excelItem.getExplanationImageURL());
            explanationImageUrl = blobUrlToFileUrlMap == null ?
                    explanationImageUrl :
                    blobUrlToFileUrlMap.getOrDefault(explanationImageUrl, null);
            explanation = Explanation.builder().build();
            explanation.setVideoUrl(videoUrl);
            explanation.setCorrectAnswer(correctAnswer);
            explanation.setImageUrl(explanationImageUrl);
            explanation.setText(explanationText);
            explanation.setQuestion(question);
            question.setExplanation(explanation);
            explanationList.add(explanation);

            String option1ImageUrlExcelValue = excelItem.getOption1Image();
            option1ImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    option1ImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(option1ImageUrlExcelValue, null);
            List<QuestionOptions> optionsList2 = new ArrayList<>();
            if (excelItem.getOption1Image() != null || excelItem.getOption1Value() != null) {
                optionsList2.add(QuestionOptions.builder()
                        .setQuestion(question)
                        .setKey("A")
                        .setValue(excelItem.getOption1Value())
                        .setQuestion(question)
                        .setImageUrl(option1ImageUrlExcelValue)
                        .build());
            }

            String option2ImageUrlExcelValue = excelItem.getOption2Image();
            option2ImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    option2ImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(option2ImageUrlExcelValue, null);
            if (excelItem.getOption2Image() != null || excelItem.getOption2Value() != null) {
                optionsList2.add(QuestionOptions.builder()
                        .setQuestion(question)
                        .setKey("B")
                        .setValue(excelItem.getOption2Value())
                        .setImageUrl(option2ImageUrlExcelValue)
                        .build());
            }

            String option3ImageUrlExcelValue = excelItem.getOption3Image();
            option3ImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    option3ImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(option3ImageUrlExcelValue, null);
            if (excelItem.getOption3Image() != null || excelItem.getOption3Value() != null) {
                optionsList2.add(QuestionOptions.builder()
                        .setQuestion(question)
                        .setKey("C")
                        .setValue(excelItem.getOption3Value())
                        .setImageUrl(option3ImageUrlExcelValue)
                        .build());
            }

            String option4ImageUrlExcelValue = excelItem.getOption4Image();
            option4ImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    option4ImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(option4ImageUrlExcelValue, null);
            if (excelItem.getOption4Image() != null || excelItem.getOption4Value() != null) {
                optionsList2.add(QuestionOptions.builder()
                        .setQuestion(question)
                        .setKey("D")
                        .setValue(excelItem.getOption4Value())
                        .setImageUrl(option4ImageUrlExcelValue)
                        .build());
            }

            String option5ImageUrlExcelValue = excelItem.getOption5Image();
            option5ImageUrlExcelValue = blobUrlToFileUrlMap == null ?
                    option5ImageUrlExcelValue :
                    blobUrlToFileUrlMap.getOrDefault(option5ImageUrlExcelValue, null);
            if (excelItem.getOption5Image() != null || excelItem.getOption5Value() != null) {
                optionsList2.add(QuestionOptions.builder()
                        .setQuestion(question)
                        .setKey("E")
                        .setValue(excelItem.getOption5Value())
                        .setImageUrl(option5ImageUrlExcelValue)
                        .build());
            }
            question.setOptions(optionsList2);
            questionList.add(question);
            optionsList.addAll(optionsList2);
        }
        List<Subject> subjectList = subjectRepository.findSubjectByExamIdAndTeacherIdAndTitleIgnoreCaseIn(
                examId, _teacher.get().getId(), subjectSet
        );
        if (subjectList.isEmpty()){
            throw new RuntimeException("Attention|Subject list can't be empty");
        }
        List<Topic> topicList = topicRepository.findByExamIdAndTitleInIgnoreCase(
                examId, topicSet
        );
        if (topicList.isEmpty()){
            throw new RuntimeException("Attention|Topic list can't be empty");
        }
        System.out.printf("\n%s\n", topicList);
        Map<String, Integer> subjectHashMap = subjectList.stream().collect(Collectors.toMap(
                subject -> subject.getTitle().toLowerCase().trim(),
                Subject::getId
        ));
        Map<String, Integer> topicHashMap = topicList.stream().collect(Collectors.toMap(
                topic -> topic.getTitle().toLowerCase().trim(),
                Topic::getId
        ));

        Topic notInSubject = null;
        for (Topic topic: topicList){
            if (topic == null ){
                throw new RuntimeException("Attention|Topic is not in our list: " );
            }
            if (topic.getSubject()== null){
                throw new RuntimeException("Attention|Topic's subject missing in database: " );
            }
            if ( !subjectList.contains(topic.getSubject()) ) {
                notInSubject = topic;
            }
        }
        if (notInSubject != null) {
            throw new RuntimeException("Attention|Topic is not in subject: " + notInSubject.getTitle() );
        }
        questionList.forEach((Question question) -> {
            question.setSubject_id(subjectHashMap.get(question.getSubjectName()));
            question.setTopic_id(topicHashMap.get(question.getTopicName()));
        });
        questionRepository.saveAll(questionList);
        List<Integer> questionListArray = questionList.stream()
                .map(Question::getId)
                .collect(Collectors.toList());
        System.out.printf("\n%s\n", questionListArray);

        TableSequence _tableSequence = tableSequenceRepository.findOneByTableType("module");
        if (_tableSequence==null) {
            _tableSequence = TableSequence.builder()
                    .setSequence(1)
                    .setTableType("module")
                    .build();
        } else {
            _tableSequence.setSequence(_tableSequence.getSequence() + 1);
        }
        tableSequenceRepository.save(_tableSequence);
        System.out.printf("\n%s\n", _tableSequence);
        ExamModule module = ExamModule.builder()
                .setSequence(questionSequence)
                .setExam(_exam.get())
                .setFileName(filename)
                .setTeacher(_teacher.get())
                .build();
        module.setQuestions(module.storeQuestionsAsString(questionListArray));
        examModuleRepository.save(module);
        bulkCreateModuleModuleResponse.setExamModule(module);
        bulkCreateModuleModuleResponse.setQuestionList(questionList);
        return bulkCreateModuleModuleResponse;

    }

    @Transactional
    public BulkCreateLessonResponse importLessonFromExcelV2(
            Integer examId, Integer teacherId, String filename
    ) throws IOException {
        InputStream stream = new FileInputStream(directoryPath +"/" + filename);
        BulkCreateModuleResponse BulkCreateModuleModuleResponse = new BulkCreateModuleResponse();
        try {
            Optional<Teacher> _teacher = teacherRepository.findById(teacherId);
            if (_teacher.isEmpty()) {
                throw new RuntimeException("Teacher Not Found Error|Teacher is not found");
            }
            Optional<Exam> _exam = examRepository.findById(examId);
            if (_exam.isEmpty()) {
                throw new RuntimeException("Exam Not Found Error|Exam is not found");
            }
            List<ExcelLessonMapper> excelList = Poiji.fromExcel(stream, PoijiExcelType.XLSX, ExcelLessonMapper.class);
            Set<String> topicSet = new HashSet<>();
            Set<String> subjectSet = new HashSet<>();
            ArrayList<Lesson> lessonList = new ArrayList<>();
            Integer lessonSequence = 0;
            for (ExcelLessonMapper excelItem : excelList) {
                topicSet.add(excelItem.getTopic().trim().toLowerCase());
                subjectSet.add(excelItem.getSubject().trim().toLowerCase());
                Lesson lesson = Lesson.builder()
                        .setUrl(excelItem.getLessonURL())
                        .setTitle(excelItem.getTitle())
                        .setTopicName(excelItem.getTopic().trim().toLowerCase())
                        .setSubjectName(excelItem.getSubject().trim().toLowerCase())
                        .setSequence(excelItem.getRowIndex())
                        .build();
                lessonList.add(lesson);
            }
            System.out.printf("\n%s\n", lessonList);
            List<Subject> subjectList = subjectRepository.findSubjectByExamIdAndTitleInIgnoreCase(
                    examId, subjectSet
            );
            System.out.printf("\n%s\n", subjectList);
            List<Topic> topicList = topicRepository.findByExamIdAndTitleInIgnoreCase(
                    examId, topicSet
            );
            Map<String, Integer> subjectHashMap = subjectList.stream().collect(Collectors.toMap(
                    subject -> subject.getTitle().toLowerCase().trim(),
                    Subject::getId
            ));
            Map<String, Integer> topicHashMap = topicList.stream().collect(Collectors.toMap(
                    topic -> topic.getTitle().toLowerCase().trim(),
                    Topic::getId
            ));
            System.out.printf("\n%s\n", subjectHashMap);
            System.out.printf("\n%s\n", topicHashMap);


            boolean isTopicInSubject = topicList.stream().allMatch((Topic item) -> subjectList.contains(item.getSubject()));
            if (!isTopicInSubject) {
                throw new RuntimeException("Attention|One of the topics given is not in subject");
            }
            System.out.printf("\n%s\n", isTopicInSubject);
            System.out.printf("\n%s\n", lessonList);

            lessonList.forEach((Lesson lesson) -> {
                lesson.setSubjectId(subjectHashMap.get(lesson.getSubjectName()));
                lesson.setTopicId(topicHashMap.get(lesson.getTopicName()));
            });
            System.out.printf("\n%s\n", lessonList);

            lessonRepository.saveAll(lessonList);
            Optional<TableSequence> _tableSequence = Optional.ofNullable(
                    tableSequenceRepository.findOneByTableType("lesson")
            );
            TableSequence tableSequence;
            if (_tableSequence.isEmpty()) {
                tableSequence = TableSequence.builder()
                        .setSequence(1)
                        .setTableType("lesson")
                        .build();
            } else {
                tableSequence = _tableSequence.get();
                tableSequence.setSequence(tableSequence.getSequence() + 1);
            }
            tableSequenceRepository.save(tableSequence);
            return BulkCreateLessonResponse.builder()
                    .setLessonList(lessonList)
                    .build();
        } catch (Exception error) {
            throw new RuntimeException(error);
        } finally {
            stream.close();
        }
    }

    public void deleteFileOrFolderById(String username, String id) {
        try {
            Drive service = getInstance(username);
            service.files().delete(id).execute();
        } catch (IOException | GeneralSecurityException e) {
            throw new RuntimeException(e);
        }
    }
}