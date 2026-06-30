import { useEffect, useState } from 'react';
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import css from './App.module.css';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import type { NoteFormValues } from '../../types/note';
import { useDebouncedCallback } from 'use-debounce';
import Loader from '../Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
      setCurrentPage(1);
    },
    1000
  );

  const queryClient = useQueryClient();

  const postNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note'] });
    },
  });

  const handlePostNote = (note: NoteFormValues) => {
    setIsModalOpen(false);
    postNoteMutation.mutate(note);
  };

  const handleDeleteNote = (id: string) => {
    setIsModalOpen(false);
    deleteNoteMutation.mutate(id);
  };

  const { data, isLoading, isSuccess, isError, error } = useQuery({
    queryKey: ['note', search, currentPage],
    queryFn: () => fetchNotes({ search: search, page: currentPage }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isSuccess === true && data.notes.length === 0) {
      toast('No notes were found for your search.');
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError === true && error !== undefined) {
      toast.error(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (
      postNoteMutation.isError === true &&
      postNoteMutation.error !== undefined
    ) {
      toast.error(postNoteMutation.error.message);
    }
  }, [postNoteMutation.isError, postNoteMutation.error]);

  useEffect(() => {
    if (
      deleteNoteMutation.isError === true &&
      deleteNoteMutation.isError !== undefined
    ) {
      toast.error(deleteNoteMutation.error.message);
    }
  }, [deleteNoteMutation.isError, deleteNoteMutation.error]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {(isLoading ||
        postNoteMutation.isPending ||
        deleteNoteMutation.isPending) && <Loader />}
      {data !== null &&
        data !== undefined &&
        data.notes !== undefined &&
        data.notes.length > 0 && (
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
        )}
      {isModalOpen === true && (
        <Modal onClose={closeModal}>
          <NoteForm
            onProcessSubmit={handlePostNote}
            onCancel={closeModal}
            isPending={postNoteMutation.isPending}
          />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}

export default App;
