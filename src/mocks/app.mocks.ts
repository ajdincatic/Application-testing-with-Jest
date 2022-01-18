import { DeleteResult } from "typeorm";
import { Books } from "../books/book.entity";

export const mockBookEntity: Books = {
  id: 1,
  title: "test book",
  year: "2021",
  author: "test author",
  cover:
    "https://res.cloudinary.com/dpisyrhal/image/upload/v1629991767/crbynstd4xpie43sgj8d.jpg",
  coverId: "crbynstd4xpie43sgj8d",
};

export const mockBooksService = {
  index: jest.fn().mockResolvedValue([mockBookEntity]),
  findOne: jest.fn().mockResolvedValue(mockBookEntity),
  findByTitle: jest.fn().mockResolvedValue([mockBookEntity]),
  save: jest.fn().mockResolvedValue(mockBookEntity),
  delete: jest.fn().mockResolvedValue(true),
};

export const mockBooksRepository = {
  find: jest.fn().mockResolvedValue([mockBookEntity]),
  findOne: jest.fn().mockResolvedValue(mockBookEntity),
  save: jest.fn().mockResolvedValue(mockBookEntity),
  delete: jest.fn().mockResolvedValue(new DeleteResult()),
};

export const mockCloudinaryService = {
  uploadImage: jest.fn().mockResolvedValue(mockBookEntity.cover),
  deleteImage: jest.fn().mockResolvedValue(true),
};

export const mockResObject = {
  redirect: jest.fn().mockReturnValue({ status: 301 }),
};
