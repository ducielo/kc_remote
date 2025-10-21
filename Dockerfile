FROM node:22-alpine
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY . .
RUN pnpm install
EXPOSE 5173
CMD ["pnpm", "run", "dev", "--", "--host"]






