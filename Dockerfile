ARG APP_LOCATION=/usr/src/app

FROM node:18.16-alpine3.17 as base
USER root

FROM base as packager
ARG ENVIRONMENT=development
ENV NODE_ENV=$ENVIRONMENT
ARG APP_LOCATION
WORKDIR $APP_LOCATION
COPY ["package.json", "package-lock.json", "tsconfig.json" ,"./"]
RUN npm install
COPY . .

FROM packager as development
ARG ENVIRONMENT=dev
ENV NODE_ENV=dev
CMD ["sh", "-c", "npm run dev"]

FROM packager as builder
RUN npm run build
COPY src .

FROM builder as cleaner
RUN npm prune --omit=dev

FROM base as production
ARG ENVIRONMENT=production
ENV NODE_ENV=$ENVIRONMENT
ARG APP_LOCATION
WORKDIR $APP_LOCATION
COPY --chown=node:node ["package.json", "package-lock.json", "./"]
COPY --chown=node:node --from=packager $APP_LOCATION/package-lock.json ./package-lock.json
COPY --chown=node:node --from=cleaner $APP_LOCATION/node_modules ./node_modules
COPY --chown=node:node --from=builder $APP_LOCATION/dist ./dist
RUN rm -rf $APP_LOCATION/src $APP_LOCATION/test $APP_LOCATION/tsconfig*
USER node

CMD ["node", "dist/api/server"]