FROM node:18-alpine
COPY ./server/ .
COPY server/.env.docker ./.env
RUN npm install 
CMD ["npm", "start"] 
EXPOSE 8000
