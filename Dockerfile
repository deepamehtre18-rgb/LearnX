FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY backend/src ./src
COPY lib ./lib

RUN mkdir -p out && javac -cp "lib/*" -d out $(find src -type f -name "*.java")

EXPOSE 8080

CMD ["java", "-cp", "out:lib/*", "ApiServer"]