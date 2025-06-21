FROM node:22-alpine AS development

WORKDIR /usr/src/app

ENV PNPM_ENABLE_PREPOSTINSTALL=1

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install
COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build
#----------------------------------
FROM node:22-alpine AS test
WORKDIR /usr/src/app

ENV NODE_ENV=development
ENV PNPM_ENABLE_PREPOSTINSTALL=1
RUN npm install -g pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install

COPY . .

RUN pnpm exec prisma generate

#----------------------------------
FROM node:22-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

ENV PNPM_ENABLE_PREPOSTINSTALL=1

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/prisma ./prisma
COPY --from=development /usr/src/app/.env .env

RUN pnpm exec prisma generate

CMD ["node", "dist/main"]
