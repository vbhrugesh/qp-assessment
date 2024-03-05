# qp-assessment

## Set-up environment for Docker and Prisma

- Build, fetch and run docker containers
```
docker-compose up -d
```
Once containers have been started, run the following commands:

```
npx prisma migrate dev --name init
```