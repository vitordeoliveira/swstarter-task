FROM node

WORKDIR /app

RUN npm install -g pnpm@10.24.0

COPY . .

RUN pnpm install && \
    mkdir -p data && \
    pnpm db:migrate && \
    pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
