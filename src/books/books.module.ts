import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./books.controller";
import { BooksService } from "./books.service";
import { BookRepository } from "./book.repository";
import { ApiController } from "../api/api.controller";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [TypeOrmModule.forFeature([BookRepository]), CloudinaryModule],
  providers: [BooksService],
  controllers: [AppController, ApiController],
})
export class BooksModule {}
