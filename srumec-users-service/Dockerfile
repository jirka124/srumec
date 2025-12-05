# .:: build stage ::.
FROM rust:1.88 AS builder

WORKDIR /app

ARG DATABASE_URL

# set the environment variable in the container to the value of the build-time argument
ENV DATABASE_URL=$DATABASE_URL

# copy all files from the build context into the container
COPY . .

# compile the Rust app
RUN cargo build --release

# .:: run stage ::.
FROM ubuntu:22.04

WORKDIR /usr/local/bin

COPY --from=builder /app/target/release/user-service .

CMD ["./user-service"]