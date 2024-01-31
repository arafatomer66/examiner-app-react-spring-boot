FROM maven:3.8.7-openjdk-18-slim
 
RUN mkdir /api-app
WORKDIR /api-app

COPY pom.xml ./
RUN mvn dependency:go-offline
 
COPY docker-entrypoint.sh ./
COPY src ./src