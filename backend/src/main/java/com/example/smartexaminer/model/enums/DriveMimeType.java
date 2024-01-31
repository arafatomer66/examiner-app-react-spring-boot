package com.example.smartexaminer.model.enums;

public enum DriveMimeType {
    XLS("xls", "application/vnd.ms-excel"),

    XLSX("xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    XML("xml", "text/xml"),
    ODS("ods", "application/vnd.oasis.opendocument.spreadsheet"),
    CSV("csv", "text/plain"),
    TMPL("tmpl", "text/plain"),
    PDF("pdf", "application/pdf"),
    PHP("php", "application/x-httpd-php"),
    JPG("jpg", "image/jpeg"),
    PNG("png", "image/png"),
    GIF("gif", "image/gif"),
    BMP("bmp", "image/bmp"),
    TXT("txt", "text/plain"),
    DOC("doc", "application/msword"),
    DOC_GOOGLE("doc_google", "application/vnd.google-apps.document"),
    JS("js", "text/js"),
    SWF("swf", "application/x-shockwave-flash"),
    MP3("mp3", "audio/mpeg"),
    ZIP("zip", "application/zip"),
    RAR("rar", "application/rar"),
    TAR("tar", "application/tar"),
    ARJ("arj", "application/arj"),
    CAB("cab", "application/cab"),
    HTML("html", "text/html"),
    HTM("htm", "text/html"),
    DEFAULT("default", "application/octet-stream"),
    FOLDER("folder", "application/vnd.google-apps.folder");


    private final String extension;
    private final String mimeType;

    DriveMimeType(String extension, String mimeType) {
        this.extension = extension;
        this.mimeType = mimeType;
    }

    public String getExtension() {
        return extension;
    }

    public String getMimeType() {
        return mimeType;
    }

    public static DriveMimeType findByExtension(String extension) {
        DriveMimeType result;
        String extensionList = "[ ";
        DriveMimeType mimeTypeToReturn = null;
        for (DriveMimeType mimeType : values()) {
            extensionList = extensionList.concat(mimeType.getExtension() + ", ");
            if (mimeType.getExtension().equals(extension)) {
                mimeTypeToReturn = mimeType;
            }
        }
        extensionList = extensionList.concat(" ]");
        if (mimeTypeToReturn == null) {
            throw new RuntimeException("Mime type must be of " + extensionList);
        } else {
            result = mimeTypeToReturn;
        }
        return result;
    }
}
