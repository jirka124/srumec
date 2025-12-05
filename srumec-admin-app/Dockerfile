# 1. build stage – pomocí Maven wrapperu (mvnw)
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Maven wrapper + pom
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# stáhnout dependency dopředu (rychlejší buildy)
RUN chmod +x mvnw && ./mvnw -q -B dependency:go-offline

# zdrojáky
COPY src ./src

# build JAR
RUN ./mvnw -q -B package -DskipTests


# 2. runtime stage – malý JRE obraz
FROM eclipse-temurin:21-jre

WORKDIR /app

# z buildu vezmeme výsledný jar (pokud máš jiný název, klidně ho napiš místo *)
COPY --from=build /app/target/*.jar app.jar

# port, na kterém běží Spring Boot (typicky 8080)
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
