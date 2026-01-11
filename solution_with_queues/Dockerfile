FROM node

WORKDIR /app

RUN npm install -g pnpm@10.24.0

COPY . .
RUN chmod +x /app/entrypoint.sh

RUN mkdir -p data

RUN pnpm install
RUN pnpm db:generate
RUN pnpm build

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["pnpm", "start"]
