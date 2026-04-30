# Learning Log

## Prisma

## Redis

## Zod



## Nodemail & Mailtrap

## date-fns(js module)

## GET vs POST

## Move data to Database
### export data from local database
```
pg_dump -U postgres -h localhost -d your_db_name --data-only --inserts > data.sql
```
### push data to cloud database
```
psql "your-supabase-url?sslmode=require" -f data.sql
```