package com.example.smartexaminer.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role  implements GrantedAuthority {
        PARENT, ADMIN,
        TEACHER, STUDENT,
        BACKOFFICEREVIEWER, BACKOFFICEUPLOADER;
        @Override
        public String getAuthority() {
                return name();
        }
}


