package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.*;
import com.example.smartexaminer.model.dto.bulk.BulkCreateLessonResponse;
import com.example.smartexaminer.model.dto.bulk.BulkCreateModuleDto;
import com.example.smartexaminer.model.dto.bulk.BulkCreateModuleResponse;
import com.example.smartexaminer.service.GoogleDriveService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping(value = "/api/v1/drive")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
public class GoogleDriveController {
    @Autowired
    private GoogleDriveService service;

    @Autowired
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/url")
    public ResponseEntity<ResponseData> getURL(
    ) throws GeneralSecurityException, IOException {
        String url = service.getCredentialsURL();
        Map<String, Object> res = new HashMap<>();
        res.put("url", url);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/login/google", method = RequestMethod.GET, params = "code")
    public ResponseEntity<ResponseData> oauth2Callback(
            Authentication authentication,
            @RequestParam(value = "code") String code
    ) throws GeneralSecurityException, IOException {
        Map<String, Object> res = new HashMap<>();
        boolean isSaved;
        String email = authentication.getName();
        Credential credential = service.oauth2Callback(email, code);
        String accessToken = credential.getAccessToken();
        String refreshToken = credential.getRefreshToken();
        isSaved = service.saveUserCredsInDatabase(email, accessToken, refreshToken);
        res.put("accessToken", accessToken);
        res.put("refreshToken", refreshToken);
        res.put("isSaved", isSaved);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/image/{id}")
    public ResponseEntity<ResponseData> getImageById(
            Authentication authentication,
            @PathVariable("id") String fileId
    ) {
        Map<String, Object> res = new HashMap<>();
        res.put("src", service.sendMediaAndDownloadAsBase64Encoded(authentication.getName(), fileId));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);

    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/file/save/{id}")
    public ResponseEntity<ResponseData> getFileByIdAndDownloadInBackend(
            Authentication authentication,
            @PathVariable("id") String fileId
    ) throws GeneralSecurityException, IOException {
        Map<String, Object> res = new HashMap<>();
        DownloadFileBackendResponse download = service.downloadFileBackend(authentication.getName(), fileId);
        res.put("isDownloaded", download.getIsDownloaded());
        res.put("file", download.getFile());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/file/download/{id}")
    public ResponseEntity<ResponseData> getFileByIdAndSendToFrontend(
            Authentication authentication,
            @PathVariable("id") String fileId
    ) throws JsonProcessingException {
        byte[] byteArray = service.sendFileToFrontend(authentication.getName(), fileId);
        Map<String, Object> res = new HashMap<>();
        res.put("file", objectMapper.writeValueAsBytes(byteArray));
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }


    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/file/downloadAzure/{id}")
    public ResponseEntity<ResponseData> saveFileToAzure(
            Authentication authentication,
            @PathVariable("id") String fileId
    ) throws IOException, GeneralSecurityException {
        String username = authentication.getName();
        Drive drive = service.getInstance(username);
        DownloadFileAzureResponse byteArray = service.saveFileToAzure(username, fileId, drive);
        Map<String, Object> res = new HashMap<>();
        res.put("blobName", byteArray.getBlobFileName());
        res.put("driveName", byteArray.getDriveFileName());
        res.put("isDownloaded", byteArray.getIsDownloaded());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }


    @GetMapping(value = "/file/readExcelV2/")
    public ResponseEntity<ResponseData> importExcelV2(
            @RequestParam(value = "examId") Integer examId,
            @RequestParam(value = "teacherId") Integer teacherId
    ) throws IOException {
        Map<String, Object> res = new HashMap<>();
        BulkCreateModuleResponse bulkResponse = service.importModuleFromExcelV2(examId, teacherId, "bulk_create_version2.xlsx");
        res.put("module", bulkResponse.getExamModule());
        res.put("question", bulkResponse.getQuestionList());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @GetMapping(value = "/file/saveImages/{fileId}")
    public ResponseEntity<ResponseData> getFileByIdAndDownloadImagesAndFile(
            Authentication authentication,
            @PathVariable("fileId") String fileId,
            @RequestParam(value = "examId") Integer examId,
            @RequestParam(value = "teacherId") Integer teacherId
    ) throws IOException, GeneralSecurityException {
        Map<String, Object> res = new HashMap<>();
        String email = authentication.getName();
        Drive drive = service.getInstance(email);
        DownloadFileBackendResponse download = service.downloadFileBackend(email, fileId, drive);
        List<String> parentList = download.getFile().getParents();
        res.put("isDownloaded", download.getIsDownloaded());
        res.put("parents", parentList);
        res.put("fileName", download.getFile().getName());
        if (!parentList.isEmpty()) {
            List<File> fileList = service.findAllFilesInFolderById(parentList.get(0), email, "image");
            res.put("fileInformation", fileList);
            if (!fileList.isEmpty()) {
                List<DownloadFileAzureResponse> responseList = new ArrayList<>();
                for (File file : fileList) {
                    DownloadFileAzureResponse response = service.saveFileToAzure(email, file.getId(), drive);
                    responseList.add(response);
                    Map<String, String> uploadResultsMap = responseList.stream()
                            .collect(Collectors.toMap(
                                    DownloadFileAzureResponse::getDriveFileName, DownloadFileAzureResponse::getBlobFileName
                            ));
                    res.put("uploadResults", uploadResultsMap);
                }
            }

        }

        return ResponseEntity.ok(
                ResponseData.builder().
                        setCode(0)
                        .setData(res)
                        .setMessage("Success").build()
        );
    }


    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/file/saveAndReadExcelAndMakeModule/{fileId}")
    public ResponseEntity<ResponseData> getFileByIdAndDownloadInBackendAndReadExcelAndMakeModule(
            @RequestBody BulkCreateModuleDto dto,
            Authentication authentication
    ) throws IOException {
        Map<String, Object> res = new HashMap<>();
        BulkCreateModuleResponse bulkResponse = null;
        try {
            String fileName = dto.getFileName();
            Integer teacherId = dto.getTeacherId();
            Integer examId = dto.getExamId();
            Map<String, String> uploadResultsMap = dto.getUploadResults();
            bulkResponse = service.importModuleFromExcelV2(
                    examId, teacherId, fileName, uploadResultsMap
            );
            service.deleteFileInMainResources(fileName);
        } catch (IOException e) {
            throw new IOException(e);
        }
        res.put("module", bulkResponse.getExamModule());
        res.put("question", bulkResponse.getQuestionList());
        return ResponseEntity.ok(
                ResponseData.builder().
                        setCode(0)
                        .setData(res)
                        .setMessage("Success").build()
        );
    }

    // topic, subject, title, url

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @GetMapping(value = "/file/saveAndReadExcelAndMakeLesson/{fileId}")
    public ResponseEntity<ResponseData> getFileByIdAndDownloadInBackendAndReadExcelAndMakeLesson(
            Authentication authentication,
            @PathVariable("fileId") String fileId,
            @RequestParam(value = "examId") Integer examId,
            @RequestParam(value = "teacherId") Integer teacherId
    ) throws IOException, GeneralSecurityException {
        Map<String, Object> res = new HashMap<>();
        String email = authentication.getName();
        Drive drive = service.getInstance(email);
        DownloadFileBackendResponse download = service.downloadFileBackend(email, fileId, drive);
        res.put("isDownloaded", download.getIsDownloaded());

        BulkCreateLessonResponse bulkResponse = null;
        try {
            String fileName = download.getFile().getName();
            bulkResponse = service.importLessonFromExcelV2(
                    examId, teacherId, fileName
            );
            service.deleteFileInMainResources(fileName);
        } catch (IOException e) {
            throw new IOException(e);
        }
        res.put("lesson", bulkResponse.getLessonList());
        return ResponseEntity.ok(
                ResponseData.builder().
                        setCode(0)
                        .setData(res)
                        .setMessage("Success").build()
        );
    }

}
