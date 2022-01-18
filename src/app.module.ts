import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Books } from "./books/book.entity";
import { BooksModule } from "./books/books.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "ec2-44-196-68-164.compute-1.amazonaws.com",
      port: 5432,
      username: "gldlforgbomsja",
      password:
        "b9ed678c3df4ea2c406ba98ddb8eee36d963eabfa24a36bbda20fdec6432f78e",
      database: "dcmq1v1njjah0d",
      entities: [Books],
      ssl: { rejectUnauthorized: false },
      synchronize: true,
    }),
    CloudinaryModule,
    BooksModule,
  ],
})
export class AppModule {}
