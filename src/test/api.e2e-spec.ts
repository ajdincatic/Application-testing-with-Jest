import { Test } from "@nestjs/testing";
import { ApiController } from "../api/api.controller";
import { mockBooksService, mockBookEntity } from "../mocks/app.mocks";
import * as request from "supertest";
import { INestApplication } from "@nestjs/common";
import { BooksService } from "../books/books.service";

describe("Api endpoints testing (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("module should be defined", () => {
    expect(app).toBeDefined();
  });

  describe("after module is defined", () => {
    describe("get all books", () => {
      it("should return list of all books -> /api/ (GET) :: SUCCESS", async () => {
        await request(app.getHttpServer())
          .get("/api/")
          .expect(200)
          .then(async () => {
            const promise = mockBooksService.index();
            expect(mockBooksService.index).toBeCalled();
            await expect(promise).resolves.toEqual([mockBookEntity]);
          });
      });
    });

    describe("get books by title", () => {
      it("should return list of all found books by title -> /api/search (GET) :: SUCCESS", async () => {
        await request(app.getHttpServer())
          .get("/api/search")
          .query({
            title: mockBookEntity.title,
          })
          .expect(200)
          .then(async () => {
            const promise = mockBooksService.findByTitle(mockBookEntity.title);
            expect(mockBooksService.findByTitle).toBeCalledWith(
              mockBookEntity.title
            );
            await expect(promise).resolves.toEqual([mockBookEntity]);
          });
      });

      it("should throw BAD REQUEST(400) exception when title is not sent -> /api/search (GET) :: FAIL", async () => {
        await request(app.getHttpServer())
          .get("/api/search")
          .query({})
          .expect(400);
      });
    });

    describe("try call nonexistent endpoint", () => {
      it("should throw NOT FOUND(404) exception -> /api/not-valid-uri (GET) :: FAIL", async () => {
        await request(app.getHttpServer())
          .get("/api/not-valid-uri")
          .expect(404);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
