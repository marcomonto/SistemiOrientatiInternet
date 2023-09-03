FROM node:18-alpine
COPY ./todo-server/ .
COPY todo-server/.env.docker ./.env
RUN npm install 
CMD ["npm", "start"] 
EXPOSE 8000
