import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { BooksService } from "./books.service";

@Controller()
export class AppController {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly appService: BooksService
  ) {}

  @Get()
  @Render("index.hbs")
  async index() {
    return {
      books: await this.appService.index(),
    };
  }

  @Get("/add")
  @Render("add.hbs")
  async add() {
    return;
  }

  @Post("/save")
  @UseInterceptors(FileInterceptor("cover"))
  async save(
    @Res() res: any,
    @Body("title") title: string,
    @Body("author") author: string,
    @Body("year") year: string,
    @UploadedFile() cover
  ) {
    let uploadImage = await this.cloudinary.uploadImage(cover).catch(() => {
      throw new BadRequestException("Invalid file type.");
    });
    this.appService.save(title, author, year, uploadImage);
    return res.redirect("/");
  }

  @Get("/delete")
  async delete(@Res() res: any, @Query("id") id: number) {
    let findBook = await this.appService.findOne(id);
    this.cloudinary.deleteImage(findBook.coverId);
    await this.appService.delete(id);
    return res.redirect("/");
  }

  @Get("/search")
  @Render("index.hbs")
  async search(@Query("title") title: string) {
    let filterBooks = await this.appService.findByTitle(title);
    return {
      books: filterBooks,
    };
  }
}
