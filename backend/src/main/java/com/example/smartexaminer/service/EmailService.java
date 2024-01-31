package com.example.smartexaminer.service;

import com.example.smartexaminer.config.EmailConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {
    @Autowired
    private EmailConfiguration emailConfiguration;
    @Value("${server.directoryPathTemplate}")
    private  String directoryPath;

    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
        mailSenderImpl.setHost(emailConfiguration.getHost());
        mailSenderImpl.setPort(emailConfiguration.getPort());
        mailSenderImpl.setUsername(emailConfiguration.getUsername());
        mailSenderImpl.setPassword(emailConfiguration.getPassword());
        return mailSenderImpl;
    }

    public void sendSimpleMessage(String to, String from, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom(from);
        getJavaMailSender().send(message);
    }

    public void sendEmailFromTemplate(
            String sender, String recipient, String subject, String fileName, HashMap<String, String> tokenMap
    ) throws MessagingException {
        MimeMessage message = getJavaMailSender().createMimeMessage();
        message.setFrom(new InternetAddress(sender));
        message.setRecipients(MimeMessage.RecipientType.TO, recipient);
        message.setSubject(subject);
        String htmlTemplate = readFile(fileName);
        for (Map.Entry<String, String> token: tokenMap.entrySet()){
            htmlTemplate = htmlTemplate.replace("{"+ token.getKey() + "}", token.getValue());
        }
        message.setContent(htmlTemplate, "text/html; charset=utf-8");
        getJavaMailSender().send(message);
    }

    public String readFile(String fileName) {
        StringBuilder contentBuilder = new StringBuilder();
        String filePath = String.format("%s/%s", directoryPath, fileName);
        try (BufferedReader in = new BufferedReader(new FileReader(filePath))) {
            String str = "";
            while ((str = in.readLine()) != null) {
                contentBuilder.append(str);
            }
        } catch (IOException e) {
            throw new RuntimeException("Couldn't read file!");
        }
        return contentBuilder.toString();
    }


}