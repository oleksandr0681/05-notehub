import axios from 'axios';
import type { Note, NoteFormValues } from '../types/note';

const notesToken = `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`;

interface FetchNotesParameters {
  search?: string;
  tag?: string;
  page?: number;
}

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
const perPage: number = 12;

export async function fetchNotes({
  search,
  tag,
  page,
}: FetchNotesParameters): Promise<NotesHttpResponse> {
  const parameters = {
    params: {
      search: search,
      tag: tag,
      page: page,
      perPage: perPage,
    },
    headers: {
      Authorization: notesToken,
      accept: 'application/json',
    },
  };

  const response = await axios.get<NotesHttpResponse>('/notes', parameters);

  return response.data;
}

export async function createNote(note: NoteFormValues): Promise<Note> {
  const parameters = {
    headers: {
      Authorization: notesToken,
      accept: 'application/json',
    },
  };

  const response = await axios.post<Note>('/notes', note, parameters);

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const parameters = {
    headers: {
      Authorization: notesToken,
      accept: 'application/json',
    },
  };

  const response = await axios.delete<Note>(`/notes/${id}`, parameters);

  return response.data;
}
