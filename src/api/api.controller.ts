import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { BooksService } from "../books/books.service";

@Controller("api")
export class ApiController {
  constructor(private readonly appService: BooksService) {}

  @Get("/")
  @HttpCode(HttpStatus.OK)
  async index() {
    return await this.appService.index();
  }

  @Get("/search")
  @HttpCode(HttpStatus.OK)
  async search(@Query("title") title: string) {
    if (!title) throw new BadRequestException("No title");
    let filterBooks = await this.appService.findByTitle(title);
    return {
      books: filterBooks,
    };
  }
}
