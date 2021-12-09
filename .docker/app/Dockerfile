FROM node:10.17.0 AS development

# Set working directory
WORKDIR /home/node/app

RUN npm install glob rimraf

RUN npm run start:dev

FROM node:12.19.0-alpine3.9 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

COPY --from=development /home/node/app/dist ./dist

CMD ["node", "dist/main"]