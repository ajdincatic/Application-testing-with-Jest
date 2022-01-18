import { Test, TestingModule } from "@nestjs/testing";
import { BooksService } from "./books.service";
import { Books } from "./book.entity";
import {
  mockBooksService,
  mockBookEntity,
  mockBooksRepository,
} from "../mocks/app.mocks";
import { BookRepository } from "./book.repository";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm";

describe("Books service testing module", () => {
  var module: TestingModule;
  var service: BooksService;
  var repository: BookRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: getRepositoryToken(BookRepository),
          useValue: mockBooksRepository,
        },
      ],
    }).compile();

    repository = module.get<BookRepository>(BookRepository);
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("repository should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("after service with required repository is defined", () => {
    describe("when index is called in BooksService", () => {
      var serviceResult;
      var books: Books[] = [];
      beforeAll(async () => {
        serviceResult = await service.index();
        books = await repository.find();
      });

      it("should call find method in books repository one time", () => {
        expect(repository.find).toBeCalled();
        expect(repository.find).toHaveBeenCalledTimes(1);
      });

      it("should not to call find method more than one time", () => {
        expect(repository.find).not.toHaveBeenCalledTimes(100);
      });

      it("books list should be defined", async () => {
        expect(books).toBeDefined();
      });

      it("should be Array", async () => {
        expect(books).toBeInstanceOf(Array);
      });

      it("should return list of Book objects", async () => {
        expect(books).toEqual([mockBookEntity]);
      });

      it("service index method should return list of Book objects", async () => {
        expect(serviceResult).toEqual([mockBookEntity]);
      });
    });

    describe("when findOne is called in BooksService", () => {
      var serviceResult;
      var book: Books = null;
      beforeAll(async () => {
        serviceResult = await service.findOne(mockBookEntity.id);
        book = await repository.findOne(mockBookEntity.id);
      });

      it("should call findOne method in books repository with book id one time", () => {
        expect(repository.findOne).toBeCalledWith(mockBookEntity.id);
        expect(repository.findOne).toHaveBeenCalledTimes(1);
      });

      it("should not to call findOne method more than one time", () => {
        expect(repository.findOne).not.toHaveBeenCalledTimes(100);
      });

      it("found book object should be defined", async () => {
        expect(book).toBeDefined();
      });

      it("should be Object", async () => {
        expect(book).toBeInstanceOf(Object);
      });

      it("should return Book object", async () => {
        expect(book).toEqual(mockBookEntity);
      });

      it("service findOne method should return Book object", async () => {
        expect(serviceResult).toEqual(mockBookEntity);
      });
    });

    describe("when findByTitle is called in BooksService", () => {
      var serviceResult;
      var books: Books[] = [];
      beforeAll(async () => {
        serviceResult = await service.findByTitle(mockBookEntity.title);
        books = await repository.find({ title: mockBookEntity.title });
      });

      it("should call find method in books repository with book title one time", () => {
        expect(repository.find).toBeCalledWith({ title: mockBookEntity.title });
        expect(repository.find).toHaveBeenCalledTimes(1);
      });

      it("should not to call findByTitle method more than one time", () => {
        expect(repository.find).not.toHaveBeenCalledTimes(100);
      });

      it("found book object should be defined", async () => {
        expect(books).toBeDefined();
      });

      it("should be Array", async () => {
        expect(books).toBeInstanceOf(Array);
      });

      it("should return Books array", async () => {
        expect(books).toEqual([mockBookEntity]);
      });

      it("service findByTitle method should return list of found Book objects", async () => {
        expect(serviceResult).toEqual([mockBookEntity]);
      });
    });

    describe("when save is called in BooksService", () => {
      let serviceResult;
      var book: Books = null;
      let createBookDto = {
        title: mockBookEntity.title,
        author: mockBookEntity.author,
        year: mockBookEntity.year,
        cover: mockBookEntity.cover,
        coverId: mockBookEntity.coverId,
      };
      beforeAll(async () => {
        serviceResult = await service.save(
          mockBookEntity.title,
          mockBookEntity.author,
          mockBookEntity.year,
          null
        );
        book = await repository.save(createBookDto);
      });

      it("should call save method in books repository with insert parameters one time", () => {
        expect(repository.save).toBeCalledWith(createBookDto);
        expect(repository.save).toHaveBeenCalledTimes(1);
      });

      it("should not to call save method more than one time", () => {
        expect(repository.save).not.toHaveBeenCalledTimes(100);
      });

      it("found book object should be defined", async () => {
        expect(book).toBeDefined();
      });

      it("should be Object", async () => {
        expect(book).toBeInstanceOf(Object);
      });

      it("should return new created Books object", async () => {
        expect(book).toEqual(mockBookEntity);
      });

      it("service save method should return new created Books object", async () => {
        expect(serviceResult).toEqual(mockBookEntity);
      });
    });

    describe("when delete is called in BooksService", () => {
      let serviceResult;
      var result: DeleteResult;
      beforeAll(async () => {
        serviceResult = await service.delete(mockBookEntity.id);
        result = await repository.delete(mockBookEntity.id);
      });

      it("should call delete method in books repository with book id one time", () => {
        expect(repository.delete).toBeCalledWith(mockBookEntity.id);
        expect(repository.delete).toHaveBeenCalledTimes(1);
      });

      it("should not to call delete method more than one time", () => {
        expect(repository.delete).not.toHaveBeenCalledTimes(100);
      });

      it("should return delete result if book is deleted or not", async () => {
        expect(result).toEqual(new DeleteResult());
      });

      it("service delete method should return boolean true if book is deleted", async () => {
        expect(serviceResult).toEqual(true);
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
