package com.example.smartexaminer.service;


import com.example.smartexaminer.dao.UserDao;
import com.example.smartexaminer.model.dto.LoginDto;
import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.model.enums.Role;
import com.example.smartexaminer.model.enums.Status;
import com.example.smartexaminer.repository.UserRepository;
import com.example.smartexaminer.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public ResponseData attemptLoginBackOffice(LoginDto loginDto) {
        List<Role> roleList = Arrays.asList(
                Role.BACKOFFICEREVIEWER,
                Role.BACKOFFICEUPLOADER
        );
        return this.attemptLogin(loginDto, roleList);
    }

    public ResponseData attemptLoginNormal(LoginDto loginDto) {
        List<Role> roleList = Arrays.asList(
                Role.PARENT,
                Role.STUDENT,
                Role.TEACHER
        );
        return this.attemptLogin(loginDto, roleList);
    }

    public ResponseData attemptLoginAdmin(LoginDto loginDto) {
        List<Role> roleList = List.of(
                Role.ADMIN
        );
        return this.attemptLogin(loginDto, roleList);
    }

    public ResponseData attemptLogin(LoginDto loginDto, List<Role> roleList) {
        String email = loginDto.getUserName();
        String password = loginDto.getPassword();
        User user = userDao.findByEmailAndPassword(email, password);

        if (user.getStatus()!= Status.ACTIVE) {
            throw new RuntimeException("Incorrect status|Expecting user to have active status");
        }
        user.setLastLoggedIn(LocalDateTime.ofInstant(Instant.now(),
                        ZoneId.of(("UTC")))
        );
        this.userRepository.save(user);

        if (!roleList.contains(user.getRole())) {
            throw new RuntimeException("Incorrect role|Expecting these " + roleList.toString() + " roles");
        }

        Map<String, Object> tokenData = new HashMap<>();
        tokenData.put("uid", user.getId());
        tokenData.put("email", user.getUsername());
        tokenData.put("firstName", user.getFirstName());
        tokenData.put("lastName", user.getLastName());
        tokenData.put("role", user.getRole());
        tokenData.put("lastLoggedIn", user.getLastLoggedIn().toString());

        Map<String, Object> data = new HashMap<>();
        data.put("token", jwtUtil.generateToken(tokenData));
        data.put("currentUser", user.getFirstName());
        data.put("role", user.getRole());

        return ResponseData.builder()
                .setCode(0)
                .setMessage("Login Success")
                .setDescription("Login Successful")
                .setData(data).build();
    }
}
