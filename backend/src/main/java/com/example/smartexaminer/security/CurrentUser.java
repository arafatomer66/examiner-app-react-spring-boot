package com.example.smartexaminer.security;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
public class CurrentUser extends User {

    private final Integer uid;

    public CurrentUser(Integer uid, String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
        this.uid = uid;
    }

    public Integer getUid(){
        return uid;
    }


}
