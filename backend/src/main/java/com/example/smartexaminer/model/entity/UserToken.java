package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tbltoken")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserToken {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "refresh_token")
    private String refeshToken;

    @Column(name = "gapi_access_token")
    private String gapiAccessToken;

    @Column(name = "gapi_refresh_token")
    private String gapiRefreshToken;
}
