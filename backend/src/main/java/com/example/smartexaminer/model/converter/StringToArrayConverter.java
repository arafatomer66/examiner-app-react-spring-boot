package com.example.smartexaminer.model.converter;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.ArrayList;
import java.util.Arrays;

@Converter
public class StringToArrayConverter implements AttributeConverter<ArrayList<String>, String> {

    @Override
    public String convertToDatabaseColumn(ArrayList<String> stringList) {
        if (stringList == null || stringList.isEmpty()) {
            return null;
        }
        return String.join(",", stringList);
    }

    @Override
    public ArrayList<String> convertToEntityAttribute(String string) {
        if (string == null || string.isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(string.split(",")));
    }
}
