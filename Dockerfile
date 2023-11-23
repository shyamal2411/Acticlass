# Use an official Node.js runtime as the base image
FROM node:16.15.1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY Acticlass-API/package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY ./Acticlass-API .

# Expose a port that your application will listen on
EXPOSE 3000

# Define the command to run your application
CMD [ "npm", "start" ]