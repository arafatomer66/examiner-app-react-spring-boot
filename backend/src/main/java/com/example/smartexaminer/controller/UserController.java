package com.example.smartexaminer.controller;

import com.example.smartexaminer.model.dto.ChangeUserDto;
import com.example.smartexaminer.model.dto.LoginDto;
import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.dto.UserDto;
import com.example.smartexaminer.model.entity.SubscriptionPlans;
import com.example.smartexaminer.model.entity.SubscriptionUserData;
import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Value("${mail.redirectUrl}")
    private String redirectUrl;
    @Autowired
    AuthService authService;
    @Autowired
    UserService userService;
    @Autowired
    BlobService blobService;
    @Autowired
    SubscriptionUserDataService usersSubscriptionService;
    @Autowired
    SubscriptionPlansService subscriptionService;

    @PostMapping(value = "/login")
    public ResponseEntity<ResponseData> attemptLogin(@Valid @RequestBody LoginDto loginDto) {
        ResponseData response = authService.attemptLoginNormal(loginDto);
        return ResponseEntity.ok(response);
    }

    @RequestMapping(value = "/api/v1/user/getMe", method = RequestMethod.GET)
    public ResponseEntity<ResponseData> getMe(
    ) {
        Map<String, Object> res = new HashMap<>();
        User user = userService.getUser();
        SubscriptionUserData usersSubscription = usersSubscriptionService.findLatestActiveUsersSubscriptionByUserId(user.getId());
        Date newDate = new Date();
        if (usersSubscription != null
                && usersSubscription.getSubscriptionEndDate() != null
                && (usersSubscription.getSubscriptionEndDate().before(newDate))
        ) {
            usersSubscription.setActive(false);
        }
        SubscriptionPlans subscriptionActivePlan = null;
        if (usersSubscription != null) {
            subscriptionActivePlan = subscriptionService.getSubscriptionById(usersSubscription.getSubscriptionPlanId());
        }
        res.put("user", user);
        res.put("subscription", usersSubscription);
        res.put("plan", subscriptionActivePlan);
        ResponseData response = ResponseData.builder()
                .setMessage("Successful")
                .setData(res)
                .setCode(0)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/api/v1/user/changeUser")
    public ResponseEntity<ResponseData> changeUser(@Valid @RequestBody ChangeUserDto dto) {
        User user = userService.changeUser(dto);
        Map<String, Object> res = new HashMap<>();
        res.put("user", user);
        ResponseData response = ResponseData.builder()
                .setMessage("Successful")
                .setData(res)
                .setCode(0)
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/loginAdmin")
    public ResponseEntity<ResponseData> attemptLoginAdmin(@Valid @RequestBody LoginDto loginDto) {
        ResponseData response = authService.attemptLoginAdmin(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/loginBackoffice")
    public ResponseEntity<ResponseData> loginAdminBackoffice(@Valid @RequestBody LoginDto loginDto) {
        ResponseData response = authService.attemptLoginBackOffice(loginDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<ResponseData> signup(@Valid @RequestBody UserDto userDto) throws MessagingException {
        ResponseData response = userService.saveNormal(userDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signupBackoffice")
    public ResponseEntity<ResponseData> signupBackOffice(@Valid @RequestBody UserDto userDto) throws MessagingException {
        ResponseData response = userService.saveAsBackOffice(userDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/api/v1/user/uploadProfile")
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
        } else {
            byte[] bytes = file.getBytes();
            String fileName = file.getOriginalFilename();
            String fileUrl = blobService.uploadFileFromByteArray(fileName, bytes);
            userService.saveProfileImage(authentication.getName(), fileUrl);
            Map<String, Object> res = new HashMap<>();
            res.put("file", fileUrl);
            ResponseData response = ResponseData.builder().
                    setCode(0)
                    .setData(res)
                    .setMessage("Success").build();
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/account/verify-resend/{email}")
    public ResponseEntity<ResponseData> accountVerifyResend(
            @PathVariable("email") String email
    ) throws MessagingException {
        Map<String, Object> res = new HashMap<>();
        this.userService.sendConfirmationEmailAndCreateToken(email);
        res.put("verify", true);
        ResponseData response = ResponseData.builder().
                setCode(0)
                .setData(res)
                .setMessage("Success").build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/account/verify/{token}")
    public ResponseEntity<Object> accountVerifyToken(
            @PathVariable("token") String token
    ) throws URISyntaxException {
        this.userService.confirmAccount(token);
        URI yahoo = new URI(redirectUrl);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setLocation(yahoo);
        return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
    }
}
