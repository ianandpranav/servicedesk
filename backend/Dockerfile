FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

WORKDIR /app/backend
RUN mvn -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=builder /app/backend/target/servicedesk-backend-1.0.0.jar app.jar

EXPOSE 10000

ENTRYPOINT ["java","-jar","app.jar"]
