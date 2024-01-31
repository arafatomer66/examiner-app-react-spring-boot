package com.example.smartexaminer.model.entity;
import com.example.smartexaminer.model.dto.UserDto;
import com.example.smartexaminer.model.enums.Role;
import com.example.smartexaminer.model.enums.Status;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import lombok.*;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(setterPrefix = "set")
@Table(name = "tbluser")
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString()
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(columnDefinition = "BIGINT", name="id")
    private Integer id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "username")
    private String username;

    @Column(name = "display_name")
    private String displayName;

    @JsonIgnore
    @Column(name = "password")
    private String password;

    @Column(name = "profileImage")
    @Nullable
    private String profileImage;

    @Enumerated(EnumType.STRING)
    @Column(name="role")
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @JsonIgnore
    @Column(name = "activation_key")
    private String activationKey;

    @JsonIgnore
    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @JsonIgnore
    @Column(name = "activation_key_expires")
    private Date activationKeyExpires;

    @Type(type = "jsonb")
    @Column(name = "detail", columnDefinition = "jsonb")
    private Object detail;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "token_id", referencedColumnName = "id")
    @JsonIgnore
    private UserToken userTokens;

    @Column(name = "profilePicture")
    private String profilePicture;

    @Column(name = "lastLoggedIn")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDateTime lastLoggedIn;

    public User(UserDto userDto) {
        this.firstName = userDto.getFirstName();
        this.lastName = userDto.getLastName();
        this.username = userDto.getEmail();
        this.password = userDto.getPassword();
        this.displayName = userDto.getDisplayName();
        this.status = userDto.getStatus();
        this.detail = userDto.getDetail();
        this.role = Role.valueOf(String.valueOf(userDto.getRole()));
        this.status = Status.valueOf(String.valueOf(userDto.getStatus()));
    }
}