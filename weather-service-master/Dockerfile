FROM node:18-alpine
COPY . .
COPY ./.env.docker ./.env
RUN npm install 
CMD ["npm", "start"] 
EXPOSE 8002
