FROM ubuntu:16.04

RUN apt-get update && apt-get install curl -y && apt-get install sudo
RUN curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
RUN apt-get -y install build-essential
RUN apt-get -y install nodejs
RUN sudo apt-get update
RUN sudo apt-get install -y git


WORKDIR /opt/msp-ui
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]

