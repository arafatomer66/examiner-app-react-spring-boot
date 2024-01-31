package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.service.BlobService;
import com.google.api.services.drive.model.File;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/blob")
@CrossOrigin(origins = "*")
@EnableMethodSecurity
public class ImageController {
    @Autowired
    BlobService blobService;

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @PostMapping(value = "/upload")
    public ResponseEntity<ResponseData> uploadFile(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.ok(ResponseData.builder()
                    .setCode(1)
                    .setData("Failed")
                    .setMessage("Success")
                    .build());
        }
        else {
            byte[] bytes = file.getBytes();
            String fileName = file.getOriginalFilename();
            String fileUrl = blobService.uploadFileFromByteArray(fileName, bytes);
            Map<String, Object> res = new HashMap<>();
            res.put("file", fileUrl);
            ResponseData response = ResponseData.builder().
                    setCode(0)
                    .setData(res)
                    .setMessage("Success").build();
            return ResponseEntity.ok(response);
        }
    }

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('TEACHER') or hasAuthority('BACKOFFICEUPLOADER') or hasAuthority('BACKOFFICEREVIEWER')")
    @GetMapping(value = "/list")
    public ResponseEntity<ResponseData> uploadFile(
            Authentication authentication
    ) {
        Map<String, Object> res = new HashMap<>();
        res.put("file", blobService.listFiles());
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }
}
