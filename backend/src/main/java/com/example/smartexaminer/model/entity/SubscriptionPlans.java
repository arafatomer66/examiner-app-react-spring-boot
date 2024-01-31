package com.example.smartexaminer.model.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(setterPrefix = "set")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@Table(name = "tblsubscriptionplans")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionPlans implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id")
    private Integer id;
    @Column(name = "sub_price_id")
    private String priceId;

    @Type(type = "jsonb")
    @Column(columnDefinition = "jsonb", name = "list_of_exams")
    private List<Integer> examList;

    @Column(name = "duration")
    private String duration;

    @Column(name = "name")
    private String name;
    @Column(name = "description")
    private String  description;
    @Column(name = "positive")
    private String  positive;
    @Column(name = "negative")
    private String  negative;
    @Column(name = "currentprice")
    private Integer  currentprice;
    @Column(name = "active")
    private Integer active;
    @Column(name = "paymentgatewayref")
    private String paymentgatewayref = "stripe";
}

