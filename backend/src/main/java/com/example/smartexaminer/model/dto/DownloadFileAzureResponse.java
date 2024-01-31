package com.example.smartexaminer.model.dto;

import com.google.api.services.drive.model.File;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class DownloadFileAzureResponse {
    Boolean isDownloaded;
    String blobFileName;
    String driveFileName;
}
