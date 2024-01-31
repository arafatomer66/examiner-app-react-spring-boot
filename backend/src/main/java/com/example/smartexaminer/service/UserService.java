package com.example.smartexaminer.service;

import com.example.smartexaminer.dao.UserDao;
import com.example.smartexaminer.model.dto.ChangePassDto;
import com.example.smartexaminer.model.dto.ChangeUserDto;
import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.dto.UserDto;
//import com.example.smartexaminer.model.entity.Subscription;
import com.example.smartexaminer.model.entity.User;
//import com.example.smartexaminer.model.entity.UsersSubscription;
import com.example.smartexaminer.model.entity.user.*;
import com.example.smartexaminer.model.enums.Status;
import com.example.smartexaminer.repository.*;
import com.example.smartexaminer.security.CurrentUser;
import com.example.smartexaminer.utils.Common;
import com.example.smartexaminer.utils.JwtUtil;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.sendgrid.Method;
//import com.sendgrid.Request;
//import com.sendgrid.SendGrid;
//import com.sendgrid.helpers.mail.Mail;
//import com.sendgrid.helpers.mail.objects.Content;
//import com.sendgrid.helpers.mail.objects.Email;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;


import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.*;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${mail.serverUrl}")
    private String mailServerUrl;

    @Value("${account.examiner.confirmation}")
    private String confirmUrlTemplate;

    @Value("${account.examiner.changepass}")
    private String changePassUrlTemplate;

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ParentRepository parentRepository;
    @Autowired
    private BackOfficeUploaderRepository backOfficeUploaderRepository;
    @Autowired
    private BackOfficeReviewerRepository backOfficeReviewerRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;
    public UserService() {
        // empty for special reason
    }

    public Student findStudentByUserId(Integer id) {
        return studentRepository.findOneByUserId(id)
                .orElseThrow(() -> new RuntimeException("Student missing|Not found Student with id = " + id));
    }


    @Transactional
    public ResponseData saveNormal(UserDto userDto) throws MessagingException {
        if (userDao.existsByEmail(userDto.getEmail()))
            throw new RuntimeException("Email already exists!|Can't create user. Email previously used");
        userDto.setPassword(Common.md5(userDto.getPassword()));
        userDto.setStatus(Status.PENDING);
        User userNew = new User(userDto);
        userNew.setActivationKey(sendConfirmationEmailAndCreateToken(userDto.getEmail()));
        User user = userDao.save(userNew);
        switch (userDto.getRole()) {
            case STUDENT:
                Student student = Student.builder().setUserId(user.getId())
                        .setParentId(null).setRollNumber(userDto.getStudent_roll_number()).setTeacherId(userDto.getTeacher_id()).build();

                if (null == userDto.getTeacher_id())
                    throw new RuntimeException("Missing data!|Compulsory to have teacher id");
                studentRepository.save(student);
                break;
            case TEACHER:
                Teacher teacher = Teacher.builder().setUserId(user.getId())
                        .build();
                teacherRepository.save(teacher);
                break;
            case PARENT:
                Parent parent = Parent.builder().setUserId(user.getId())
                        .build();
                if (null == userDto.getStudent_id())
                    throw new RuntimeException("Missing data!|Must have student id");
                parentRepository.save(parent);
                Student studentOfParent = this.findStudentByUserId(userDto.getStudent_id());
                if (null == studentOfParent.getParentId()) {
                    studentOfParent.setParentId(parent.getId());
                    studentRepository.save(studentOfParent);
                } else {
                    throw new RuntimeException("Existing parent found!|Already has a parent to this account!");
                }
                break;
            default:
                throw new RuntimeException("Invalid role!|Can't create this role.");
        }


        return ResponseData.builder().setMessage("Saved")
                .setDescription("User successfully added")
                .setCode(0)
                .build();
    }

    @Transactional
    public ResponseData saveAsBackOffice(UserDto userDto) throws MessagingException {
        if (userDao.existsByEmail(userDto.getEmail()))
            throw new RuntimeException("Email already exists!|Can't create user. Email already used");
        userDto.setPassword(Common.md5(userDto.getPassword()));
        userDto.setStatus(Status.PENDING);
        User userNew = new User(userDto);
        userNew.setActivationKey(sendConfirmationEmailAndCreateToken(userDto.getEmail()));
        User user = userDao.save(userNew);
        switch (userDto.getRole()) {
            case BACKOFFICEREVIEWER:
                BackofficeReviewer backofficeReviewer = BackofficeReviewer.builder().setUserId(user.getId())
                        .setTeacherId(userDto.getTeacher_id()).build();
                if (null == userDto.getTeacher_id())
                    throw new RuntimeException("Missing data!|Must have teacher id");
                backOfficeReviewerRepository.save(backofficeReviewer);
                break;
            case BACKOFFICEUPLOADER:
                BackofficeUploader backofficeUploader = BackofficeUploader.builder().setUserId(user.getId())
                        .setTeacherId(userDto.getTeacher_id()).build();
                if (null == userDto.getTeacher_id())
                    throw new RuntimeException("Missing data!|Must have teacher id");
                backOfficeUploaderRepository.save(backofficeUploader);
                break;
            default:
                throw new RuntimeException("Invalid role!|Can't create this role.");
        }

        return ResponseData.builder().setMessage("Saved")
                .setDescription("User successfully added")
                .setCode(0)
                .build();
    }

    public void saveProfileImage(String email, String profileImage) {
        Optional<User> userOptional = userRepository.findUserByUsername(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setProfileImage(profileImage);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Can't find user by email=" + email);
        }
    }


    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> opt = userDao.findByEmail(s);
        if (opt.isPresent()) {
            User user = opt.get();
            return new CurrentUser(user.getId(), user.getUsername(), user.getPassword(), new ArrayList<>());
        }
        throw new UsernameNotFoundException("Invalid token email not found!");
    }

    public User getUserByUsername(String s) throws UsernameNotFoundException {
        Optional<User> opt = userDao.findByEmail(s);
        if (opt.isPresent()) {
            return opt.get();
        }
        throw new UsernameNotFoundException("Invalid token email not found!");
    }

    public String sendConfirmationEmailAndCreateToken(String email) throws MessagingException {
        final HashMap<String, String> token = new HashMap<>();
        token.put("token", UUID.randomUUID().toString());
        token.put("mailServerUrl", mailServerUrl);
        emailService.sendEmailFromTemplate(
                email, "mjrrdn@gmail.com", "Confirming account", "verify-user.html", token
        );
        return token.get("token");
    }

    public ResponseData sendChangePassUrl(String email) {
        Optional<User> opt = userDao.findByEmail(email);
        if (opt.isEmpty())
            throw new RuntimeException("Can't find email");

        final String token = UUID.randomUUID().toString();
        User user = opt.get();
        user.setPasswordResetToken(token);
        this.userRepository.save(user);
//            Email from = new Email(SG_SENDER);
//            Email to = new Email(email);
//            String strCont = "<h1>Click the url below to change your password.</h1> <a href=%s>%s</a>";
//            Content content = new Content("text/html", String.format(strCont, changePassUrl, changePassUrl));
//
//            Mail mail = new Mail(from, "Password Change", to, content);
//            Request request = new Request();
//            request.setMethod(Method.POST);
//            request.setEndpoint("mail/send");
//            request.setBody(mail.build());
//
//            sendGrid.api(request);
        return ResponseData.builder().setCode(0).setMessage("Change password link was sent to your email.").build();
    }

    public boolean confirmAccount(String token) {
        Optional<User> userOptional = this.userRepository.findUserByActivationKey(token);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Token not found!|Can't find user by token");
        } else {
            User user = userOptional.get();
            user.setActivationKey(null);
            user.setStatus(Status.ACTIVE);
            this.userRepository.save(user);
        }
        return true;
    }

    public ResponseData changePassword(String token, ChangePassDto creds) {
        Optional<Claims> opt = jwtUtil.parseToken(token);

        if (opt.isEmpty())
            throw new RuntimeException("Something went wrong parsing the change pass token!");

        Claims claims = opt.get();
        String email = (String) claims.get("email");
        String subject = (String) claims.get("subject");

        if (!subject.equals("change_pass"))
            throw new RuntimeException("Invalid change pass token!");

        Optional<User> optUser = userDao.findByEmail(email);

        if (optUser.isEmpty())
            throw new RuntimeException("Invalid change pass token!");

        User user = optUser.get();
        user.setPassword(Common.md5(creds.getPassword()));
        userDao.save(user);
        return ResponseData.builder().setCode(0).setMessage("Password Changed.").build();
    }

    public User getUser() {
        String userEmail = String.valueOf(Common.getCurrentEmail());
        return userRepository.findUserByUsername(userEmail).orElseThrow(
                () -> new RuntimeException("No user found by this email")
        );
    }

    public ResponseData updateUser(User userData) {
        // get user
        String userEmail = String.valueOf(Common.getCurrentEmail());
        User user = userRepository.findUserByUsername(userEmail).orElseThrow(
                () -> new RuntimeException("No user found by this email")
        );

        String msg = "Profile updated successfully";

        // validate email
        if (user.getUsername().equals(userData.getUsername())) {
            user.setFirstName(userData.getFirstName());
            user.setLastName(userData.getLastName());
        } else {
            // verify email
            Optional<User> userFromEmailOpt = userDao.findByEmail(userData.getUsername());
            if (userFromEmailOpt.isEmpty()) {
                user.setFirstName(userData.getFirstName());
                user.setLastName(userData.getLastName());
                user.setUsername(userData.getUsername());
                msg = "Profile updated successfully, Please login again...";
            } else {
                return ResponseData.builder().setData(null).setCode(1).setMessage("Email already registered, try another").build();
            }
        }
        userDao.save(user);

        Map<String, Object> token = new HashMap<>();
        token.put("uid", user.getId());
        token.put("email", user.getUsername());
        token.put("firstName", user.getFirstName());
        token.put("lastName", user.getLastName());

        Map<String, Object> result = new HashMap<>();
        result.put("token", jwtUtil.generateToken(token));
        result.put("currentUser", user.getFirstName());

        return ResponseData.builder().setData(result).setCode(0).setMessage(msg).build();
    }


    @Transactional
    public ResponseData thirdPartySSOLogin(UserDto userDto, String accessToken, String refreshToken, String tokenType) {
        User user = null;
        if (userDao.existsByEmail(userDto.getEmail())) {
            // login
            user = userDao.findByEmail(userDto.getEmail()).orElse(null);
        } else {
            // signup
            userDto.setPassword(Common.md5(userDto.getPassword()));
            user = userDao.save(new User(userDto));
        }
        Objects.requireNonNull(user);
        Map<String, Object> tokenData = new HashMap<>();
        tokenData.put("uid", Objects.isNull( user.getId() ) ? "none": user.getId());
        tokenData.put("email", user.getUsername());
        tokenData.put("firstName", user.getFirstName());
        tokenData.put("lastName", user.getLastName());

        Map<String, Object> data = new HashMap<>();
        data.put("token", jwtUtil.generateToken(tokenData));
        data.put("currentUser", user.getFirstName());

        return ResponseData.builder()
                .setCode(0)
                .setMessage("Login Success")
                .setDescription("Login Successful")
                .setData(data).build();
    }

    public User changeUser(ChangeUserDto dto) {
        User user = userRepository.findUserByUsername(Common.getCurrentEmail())
                .orElseThrow(
                        () -> new RuntimeException("No user found by this id")
                );
        user.setDisplayName(dto.getDisplayName());
        user.setUsername(dto.getUserName());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        userRepository.save(user);
        return user;
    }
}
