package com.example.smartexaminer.service;


import com.azure.core.util.BinaryData;
import com.azure.core.util.Context;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.options.BlobParallelUploadOptions;
import com.example.smartexaminer.config.AzureBlobProperties;
import com.example.smartexaminer.utils.Common;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlobService {

    @Value("${azure.endpointurl}")
    private String endpointUrl;
    @Autowired
    private AzureBlobProperties azureBlobProperties;

    private BlobServiceClient serviceClient() {
        System.out.println("-------------------------------------");
        System.out.println(azureBlobProperties.getConnectionstring());
        System.out.println(azureBlobProperties.getContainer());
        return new BlobServiceClientBuilder()
                .connectionString(azureBlobProperties.getConnectionstring()).buildClient();
    }

    private BlobContainerClient containerClient(){
        return serviceClient()
                        .getBlobContainerClient(azureBlobProperties.getContainer());
    }

    public List<String> listFiles() {
        log.info("List blobs BEGIN");
        BlobContainerClient container = containerClient();
        val list = new ArrayList<String>();
        for (BlobItem blobItem : container.listBlobs()) {
            log.info("Blob {}", blobItem.getName());
            list.add(blobItem.getName());
            containerClient().delete();
        }
        log.info("List blobs END");
        return list;
    }

    public ByteArrayOutputStream downloadFile(String blobitem) {
        log.info("Download BEGIN {}", blobitem);
        BlobContainerClient containerClient = containerClient();
        BlobClient blobClient = containerClient.getBlobClient(blobitem);
        ByteArrayOutputStream content = new ByteArrayOutputStream();
        blobClient.download(content);
        log.info("Download END");
        return content;
    }

    public File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + Objects.requireNonNull(multiPart.getOriginalFilename()).replace(" ", "_");
    }

    private String generateFileNameFromString(String fileName) {
        return new Date().getTime() + "-" + fileName.replace(" ", "_");
    }


    public void uploadFileToAzure(String fileName, File file){
        System.out.println("fileName for uploding new thing------------------= " + fileName);
        BlobClient client = containerClient().getBlobClient(fileName);
        client.uploadFromFile(file.getAbsolutePath(), true);
        System.out.println("--------uploaded--------------------");
    }

    public void uploadByteArrayToAzure(String fileName, byte[] bytes){
        System.out.println("fileName for uploading new thing------------------= " + fileName);
        BlobClient client = containerClient().getBlobClient(fileName);
        client.upload(BinaryData.fromBytes(bytes), true);
        client.getBlobUrl();
    }

//    String content = Common.extensionToContentType(_extension.get());
//    BlobHttpHeaders headers = new BlobHttpHeaders();
//        headers.setContentType(content);
//    BinaryData data = BinaryData.fromBytes(bytes);
//    BlobParallelUploadOptions optionsWithData = new BlobParallelUploadOptions(data)
//            .setHeaders(headers);
//        client.uploadWithResponse(optionsWithData, null, Context.NONE);

    public String storeFile(String filename, InputStream content, long length) throws IOException {

        BlobClient client = containerClient().getBlobClient(filename);
        client.upload(content, length, true);
        return "File uploaded with success!";
    }

    public String uploadFileFromByteArray(String fileName, byte[] bytearray){
        String fileUrl = "";
        try {
            fileName = generateFileNameFromString(fileName);
            fileUrl = endpointUrl + "/" + fileName;
            uploadByteArrayToAzure(fileName, bytearray);
            System.out.println("Uploaded "+ fileUrl);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    public String uploadFile(MultipartFile multipartFile){
        String fileUrl = "";
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            fileUrl = endpointUrl + "/" + fileName;
            uploadFileToAzure(fileName, file);
            System.out.println("Uploaded");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    public String uploadFileAnother(MultipartFile multipartFile) {

        String fileUrl = "";
        try {
            File file = convertMultiPartToFile(multipartFile);
            String fileName = generateFileName(multipartFile);
            fileUrl = endpointUrl+"/" + fileName;
            uploadFileToAzure(fileName, file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    public String uploadFileAnotherResize(File file, String fileName) {

        String fileUrl = "";
        try {

            fileUrl = endpointUrl+"/" + fileName;
            uploadFileToAzure(fileName, file);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    public void deleteFile(final String blobName){
        log.info("Deleting file with name= " + blobName);
        BlobClient client = containerClient().getBlobClient(blobName);
        client.delete();
        log.info("File deleted successfully");
    }


}
