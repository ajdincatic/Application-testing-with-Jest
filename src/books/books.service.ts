import { BadRequestException, Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Books } from "./book.entity";
import { BookRepository } from "./book.repository";

@Injectable()
export class BooksService {
  constructor(public readonly bookRepository: BookRepository) {}

  async index(): Promise<Books[]> {
    return await this.bookRepository.find({
      take: 10,
    });
  }

  async findOne(id: number): Promise<Books> {
    const findBook = await this.bookRepository.findOne(id);
    if (!findBook) throw new BadRequestException("Book not found");
    return findBook;
  }

  async findByTitle(title: string): Promise<Books[]> {
    let filterBooks = await this.bookRepository
      .createQueryBuilder("book")
      .where("LOWER(book.title) LIKE :title")
      .setParameters({
        title: `%${title.toLowerCase()}%`,
      })
      .take(1)
      .getMany();
    return filterBooks;
  }

  async save(
    title: string,
    author: string,
    year: string,
    uploadImage: UploadApiResponse | UploadApiErrorResponse
  ): Promise<Books> {
    if (title == null) throw new BadRequestException("Title must be inserted.");
    const book = await this.bookRepository.save({
      title,
      author,
      year,
      cover: uploadImage.url,
      coverId: uploadImage.public_id,
    });
    return book;
  }

  async delete(id: number): Promise<boolean> {
    await this.bookRepository.delete(id);
    return true;
  }
}
