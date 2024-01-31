FROM maven:3.8.7-eclipse-temurin-11-alpine as MAVEN_BUILD

WORKDIR /build

COPY pom.xml /build/
COPY src /build/src/

RUN mvn -Dmaven.test.skip=true package -Ptest

FROM adoptopenjdk/openjdk11

WORKDIR /app

COPY --from=MAVEN_BUILD /build/target/simple-spring-boot-*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]