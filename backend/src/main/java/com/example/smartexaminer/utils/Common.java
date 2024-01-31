package com.example.smartexaminer.utils;

//import javassist.compiler.ast.Pair;
import com.example.smartexaminer.model.dto.SubscriptionStartAndEndDate;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;


import javax.annotation.Nullable;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.persistence.Tuple;
import javax.xml.bind.DatatypeConverter;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;

import java.text.ParseException;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;


import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
@PropertySource("application.properties")
public class Common {


    public static final String ALGORITHM = "AES/ECB/PKCS5Padding";
    public static final String DATEFORMAT1 = "yyyy-MM-dd HH:mm:ss";
    public static final String DATEFORMAT2 = "yyyy-MM-dd";
    public static final String DATEFORMAT3 = "yyMMddHHmmssSSS";
    public static final String DATEFORMAT4 = "EEEE, MMMM d, yyyy";
    public static final String DATEFORMAT5 = "yyMMddHHmmssSSSS";
    public static final String DATEFORMAT6 = "yyyy - MMMM";
    public static final String SFDC_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";


    //DEV
    public static final byte[] API_KEY = {(byte) 33, (byte) 81, (byte) 97, (byte) 52, (byte) 69, (byte) 102, (byte) 73, (byte) 36, (byte) 64, (byte) 70, (byte) 51, (byte) 50, (byte) 38, (byte) 63, (byte) 49, (byte) 57};

    //LIVE
    //public static final byte[] API_KEY = {(byte) 51, (byte) 80, (byte) 64, (byte) 56, (byte) 33, (byte) 115, (byte) 74, (byte) 47, (byte) 71, (byte) 33, (byte) 84, (byte) 42, (byte) 37, (byte) 108, (byte) 75, (byte) 114};

    //public static final String UPLOADPATH = "/home/upload/ydot.perapay.asia/upload/";
    //public static final String UPLOADPATH = "/Users/angelohalos/Documents/Master File/8D/Repo/8dproject/backend.perapay.asia/web/upload/";

    public static String trimToEmpty(String str) {
        return str == null ? "" : str.trim();
    }

    public static String trimToZero(String str) {
        return !str.isEmpty() ? str.trim() : "0";
    }

    public static String extensionToContentType (String extension){
        Map<String, String> contentTypeMap = new HashMap<>();
        contentTypeMap.put("txt", "text/plain");
        contentTypeMap.put("html", "text/html");
        contentTypeMap.put("pdf", "application/pdf");
        contentTypeMap.put("json", "application/json");
        contentTypeMap.put("xml", "application/xml");
        contentTypeMap.put("jpg", "image/jpg");
        contentTypeMap.put("jpeg", "image/jpeg");
        contentTypeMap.put("svg", "image/svg");
        contentTypeMap.put("png", "image/png");
        contentTypeMap.put("gif", "image/gif");
        contentTypeMap.put("mp3", "audio/mpeg");
        contentTypeMap.put("mp4", "video/mp4");
        contentTypeMap.put("zip", "application/zip");
        contentTypeMap.put("doc", "application/msword");
        return contentTypeMap.getOrDefault(extension, "application/octet");
    }


    public static Integer getCurrentId() throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication details : " + authentication);
        if (!(authentication instanceof AnonymousAuthenticationToken))
            return (Integer) authentication.getCredentials();
        throw new RuntimeException("Unauthorized access|You are not authorized to perform this operation");
    }

    public static String md5(String input) {
        StringBuilder res = new StringBuilder();
        try {
            MessageDigest algorithm = MessageDigest.getInstance("MD5");
            algorithm.reset();
            algorithm.update(input.getBytes());
            byte[] md5 = algorithm.digest();
            String tmp = "";
            for (byte b : md5) {
                tmp = (Integer.toHexString(0xFF & b));
                if (tmp.length() == 1) {
                    res.append("0").append(tmp);
                } else {
                    res.append(tmp);
                }
            }
        } catch (NoSuchAlgorithmException ex) {
            ex.printStackTrace();
        }
        return res.toString();
    }

    public static String encrypt(String data, byte[] key) {
        String res = "";
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec secretKey = new SecretKeySpec(key, "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            res = DatatypeConverter.printBase64Binary(cipher.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    public static String decrypt(String data, byte[] key) {
        String res = "";
        try {
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            SecretKeySpec secretKey = new SecretKeySpec(key, "AES");
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            res = new String(cipher.doFinal(DatatypeConverter.parseBase64Binary(data)), StandardCharsets.UTF_8);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    public static boolean isNullandEmpty(String str) {
        return (str == null || str.trim().isEmpty());
    }

    public static boolean isValidEmail(String emailAddress) {
        return !emailAddress.contains(" ") && emailAddress.matches(".+@.+\\.[a-z]+");
    }

    public static String truncate(String value, int length) {
        if (value != null && value.length() > length) {
            value = value.substring(0, length);
        }
        return value;
    }

    public static boolean isLegalDate(String yyyyMMdd) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setLenient(false);
        return sdf.parse(yyyyMMdd, new ParsePosition(0)) != null;
    }

    public static String getTimeStamp(String dateFormat) {
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        Calendar c1 = Calendar.getInstance();
        return sdf.format(c1.getTime());
    }

    public static String getUTCTimeStamp() {
        return ZonedDateTime.now().withZoneSameInstant(ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern(SFDC_FORMAT));
    }

    public static String getUTCTimeStamp(String input) {
        try {
            LocalDateTime ldt = LocalDateTime.parse(input, DateTimeFormatter.ofPattern(DATEFORMAT1));
            ZonedDateTime zdt = ldt.atZone(ZoneId.systemDefault());
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern(SFDC_FORMAT);
            return dtf.format(zdt.withZoneSameInstant(ZoneId.of("UTC")));
        } catch (Exception ex) {
            ex.printStackTrace();
            return "0000-00-00";
        }
    }

    public static boolean isValidNumber(String number) {
        boolean resp = false;
        try {
            String expression = "[-+]?[0-9]*\\.?[0-9]+$";
            Pattern pattern = Pattern.compile(expression);
            Matcher matcher = pattern.matcher(number);
            if (matcher.matches()) {
                resp = true;
            }
        } catch (Exception ex) {
        }
        return resp;
    }

    public static String getUniqueWord(int len) {
        String word = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++)
            sb.append(word.charAt(rnd.nextInt(word.length())));
        return sb.toString();
    }

    public static String formatDate(String input, String DateFormat) {
        try {
            DateFormat formatter = new SimpleDateFormat(DATEFORMAT2);
            Date date = formatter.parse(input);
            String newDate;
            newDate = new SimpleDateFormat(DateFormat).format(date);
            return newDate;
        } catch (Exception ex) {
            ex.printStackTrace();
            return "0000-00-00";
        }
    }


    public static String getCurrentEmail() throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("authentication details : " + authentication);
        if (!(authentication instanceof AnonymousAuthenticationToken))
            return  authentication.getName();
        throw new RuntimeException("Unauthorized access|You are not authorized to perform this operation");
    }

    public static String getEmail() throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken))
            return (String) (authentication.getPrincipal());
        throw new RuntimeException("Unauthorized access|You are not authorized to perform this operation");
    }

    public static String getCurrentRole() throws RuntimeException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken))
            return ((List<GrantedAuthority>) authentication.getAuthorities()).get(0).getAuthority();
        throw new RuntimeException("Unauthorized access|You are not authorized to perform this operation");
    }


    public static String addDaysToDate(String date, int daysToAdd) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(DATEFORMAT2);
            Date d = sdf.parse(date);
            Calendar c = Calendar.getInstance();
            c.setTime(d);
            c.add(Calendar.DAY_OF_MONTH, daysToAdd);
            return sdf.format(c.getTime());
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format!|" + e.getMessage());
        }
    }

    public static String subtractMinsToTime(String time, int minsToSubtract) {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat(DATEFORMAT1);
            Date d = sdf.parse(time);
            Calendar c = Calendar.getInstance();
            c.setTime(d);

            c.add(Calendar.MINUTE, -minsToSubtract);
            return sdf.format(c.getTime());
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format!|" + e.getMessage());
        }
    }

    public static String returnNullIfEmpty(@Nullable String value){
        if (value==null){
            return value;
        }
        else{
            value = value.trim();
            if (value.isEmpty()) return null;
            else return value;
        }
    }


    public static String wrapWithSingleQuote(String str) {
        return "'" + str + "'";
    }

    public static int[] getRanges(int page, int limit) {
        int start = page > 1
                ? ((page - 1) * limit)
                : 0;
        int end = page * limit;
        return new int[]{start, end};
    }
    public static SubscriptionStartAndEndDate getSubscriptionStartAndEndDate(String subscriptionStarted){
        LocalDateTime todayDate = LocalDateTime.now();
        Date time = null;
        try {
            time = new SimpleDateFormat("yyyy-MM-dd").parse(subscriptionStarted);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        LocalDateTime subscriptionStartedDate = LocalDateTime.ofInstant(time.toInstant(),
                ZoneId.of(("UTC")));
        int subscriptionStartedDay = subscriptionStartedDate.getDayOfMonth();

        LocalDateTime mayStarDay = todayDate.withDayOfMonth(subscriptionStartedDay);

        LocalDateTime startDate;
        LocalDateTime endDate;
        if(mayStarDay.isAfter(todayDate)){
            startDate = mayStarDay.minusMonths(1);
            endDate = mayStarDay;
        }else{
            startDate = mayStarDay;
            endDate = mayStarDay.plusMonths(1);
        }
        return new SubscriptionStartAndEndDate(startDate, endDate);
    }
}
