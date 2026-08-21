FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY src ./src
COPY lib ./lib

RUN javac -d out $(find src -name "*.java")

EXPOSE 8080

CMD ["java", "-cp", "out:lib/mysql-connector-j-9.4.0.jar", "ApiServer"]