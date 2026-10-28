# Use official Amazon Corretto Java 21 image as parent image
FROM amazoncorretto:21-alpine

# Set working directory inside the container
WORKDIR /app

# Copy the built jar file from local machine to the container
COPY target/rickandmorty-app-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (defaulting to 8081 as per your lab setup)
EXPOSE 8081

# Run the jar file when the container launches
ENTRYPOINT ["java", "-jar", "app.jar"]