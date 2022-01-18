import { Test, TestingModule } from "@nestjs/testing";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { AppController } from "./books.controller";
import { BooksService } from "./books.service";
import { Books } from "./book.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import {
  mockBooksService,
  mockCloudinaryService,
  mockBookEntity,
  mockResObject,
} from "../mocks/app.mocks";

describe("Books controller testing module", () => {
  var module: TestingModule;
  var controller: AppController;
  var booksService: BooksService;
  var cloudinaryService: CloudinaryService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    booksService = module.get<BooksService>(BooksService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it("books service should be defined", () => {
    expect(booksService).toBeDefined();
  });

  it("cloudinary service should be defined", () => {
    expect(cloudinaryService).toBeDefined();
  });

  it("controller should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("after controller with all services is defined", () => {
    describe("when index is called in Books controller", () => {
      var books = null;
      var booksFromService: Books[] = [];

      beforeAll(async () => {
        books = await controller.index();
        booksFromService = await booksService.index();
      });

      it("should call booksService index method one time and return list of books", async () => {
        expect(booksService.index).toBeCalled();
        expect(booksFromService).toEqual([mockBookEntity]);
      });

      it("should not throw error because service will be called", async () => {
        expect(booksService.index).not.toThrowError();
      });

      it("should return from controller view and object with list of books", () => {
        expect(books).toEqual({ books: [mockBookEntity] });
      });
    });

    describe("when add is called in Books controller", () => {
      it("should render new view", () => {
        controller.add();
        const add = jest.fn().mockResolvedValue(() => {
          return;
        });
        add();
        expect(add).toHaveBeenCalled();
      });
    });

    describe("when save is called in Books controller", () => {
      var cover: Express.Multer.File;
      var booksFromService: Books;
      var uploadResult: UploadApiResponse | UploadApiErrorResponse;
      var res: any;

      beforeEach(async () => {
        res = mockResObject;
        await controller.save(
          res,
          mockBookEntity.title,
          mockBookEntity.author,
          mockBookEntity.year,
          cover
        );
        uploadResult = await cloudinaryService.uploadImage(cover);
        booksFromService = await booksService.save(
          mockBookEntity.title,
          mockBookEntity.author,
          mockBookEntity.year,
          uploadResult
        );
      });

      it("should call cloudinaryService uploadImage method one time and upload cover image to Cloudinary service and return API response", async () => {
        expect(cloudinaryService.uploadImage).toBeCalledWith(cover);
        expect(uploadResult).toEqual(mockBookEntity.cover);
      });

      it("should call booksService save method one time and return new created book", async () => {
        expect(booksService.save).toHaveBeenCalledWith(
          mockBookEntity.title,
          mockBookEntity.author,
          mockBookEntity.year,
          uploadResult
        );
        expect(booksFromService).toEqual(mockBookEntity);
      });

      it("should call redirect to home page", async () => {
        expect(res.redirect).toBeCalled();
      });

      it("should return 301(Redirection) status code", async () => {
        expect(res.redirect("/").status).toEqual(301);
      });
    });

    describe("when delete is called in Books controller", () => {
      var book = null;
      var res: any;

      beforeAll(async () => {
        res = mockResObject;
        await controller.delete(res, mockBookEntity.id);
        book = await booksService.findOne(mockBookEntity.id);
        cloudinaryService.deleteImage(mockBookEntity.coverId);
        await booksService.delete(mockBookEntity.id);
      });

      it("should call booksService findOne method one time and return found book object", async () => {
        expect(booksService.findOne).toBeCalledWith(mockBookEntity.id);
        expect(book).toEqual(mockBookEntity);
      });

      it("should call (with fond book coverId) synchronously cloudinaryService deleteImage method one time and delete image", async () => {
        expect(cloudinaryService.deleteImage).toBeCalledWith(book.coverId);
      });

      it("should call booksService delete method synchronously with coludinary delete method and delete book from databse", async () => {
        expect(booksService.delete).toBeCalledWith(book.id);
      });

      it("should call redirect to home page", async () => {
        expect(res.redirect).toBeCalled();
      });

      it("should return 301(Redirection) status code", async () => {
        expect(res.redirect("/").status).toEqual(301);
      });
    });

    describe("when search is called in Books controller", () => {
      var books = null;
      var booksFromService: Books[] = [];

      beforeAll(async () => {
        books = await controller.search(mockBookEntity.title);
        booksFromService = await booksService.findByTitle(mockBookEntity.title);
      });

      it("should call booksService findByTitle method one time and return list of found books", async () => {
        expect(booksService.findByTitle).toBeCalledWith(mockBookEntity.title);
        expect(booksFromService).toEqual([mockBookEntity]);
      });

      it("should return from controller view and object with list of found books", () => {
        expect(books).toEqual({ books: [mockBookEntity] });
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
