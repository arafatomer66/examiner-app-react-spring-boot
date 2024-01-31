package com.example.smartexaminer.model.dto;

import com.google.api.services.drive.model.File;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
public class DownloadFileBackendResponse {
    Boolean isDownloaded;
    File file;
}
