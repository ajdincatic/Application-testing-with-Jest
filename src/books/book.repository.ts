import { EntityRepository, Repository } from 'typeorm';
import { Books } from './book.entity';

@EntityRepository(Books)
export class BookRepository extends Repository<Books> {}
