FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY src ./src
COPY lib ./lib

RUN javac -cp "lib/" -d out $(find src -name ".java")

EXPOSE 8080

CMD ["java", "-cp", "out:lib/*", "ApiServer"]