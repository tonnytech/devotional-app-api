// app/(admin)/books/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { togglePublish, deleteBook } from "./actions";
import DeleteButton from "@/components/ui/DeleteButton";

export const revalidate = 0;

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reviews: true } },
    },
  });

  const pendingCounts = await prisma.bookReview.groupBy({
    by: ["bookId"],
    where: { isApproved: false },
    _count: { id: true },
  });
  const pendingMap = new Map(pendingCounts.map((p) => [p.bookId, p._count.id]));

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-semibold'>Books</h1>
        <Link
          href='/books/new'
          className='bg-black text-white px-4 py-2 rounded-md text-sm'>
          Add Book
        </Link>
      </div>

      <table className='w-full text-sm'>
        <thead>
          <tr className='text-left border-b'>
            <th className='py-2'>Title</th>
            <th className='py-2'>Author</th>
            <th className='py-2'>Reviews</th>
            <th className='py-2'>Published</th>
            <th className='py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const pending = pendingMap.get(book.id) ?? 0;
            return (
              <tr key={book.id} className='border-b'>
                <td className='py-2'>{book.title}</td>
                <td className='py-2'>{book.author}</td>
                <td className='py-2'>
                  <Link
                    href={`/books/${book.id}/reviews`}
                    className='underline'>
                    {book._count.reviews}
                    {pending > 0 && (
                      <span className='ml-1 text-orange-600'>
                        ({pending} pending)
                      </span>
                    )}
                  </Link>
                </td>
                <td className='py-2'>
                  <form
                    action={togglePublish.bind(
                      null,
                      book.id,
                      !book.isPublished,
                    )}>
                    <button
                      type='submit'
                      className={
                        book.isPublished ? "text-green-600" : "text-gray-400"
                      }>
                      {book.isPublished ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className='py-2 flex gap-3'>
                  <Link href={`/books/${book.id}/edit`} className='underline'>
                    Edit
                  </Link>
                  <DeleteButton
                    id={book.id}
                    action={deleteBook}
                    itemLabel={book.title}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
