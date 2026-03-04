FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x mvnw && sed -i 's/\r$//' mvnw

# Hier bauen wir das Projekt
RUN ./mvnw clean package -DskipTests

# Wir verschieben die erzeugte JAR an einen festen Ort mit festem Namen
RUN cp target/*.jar app.jar

# Jetzt starten wir die feste Datei
CMD ["java", "-jar", "app.jar"]