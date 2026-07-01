import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import css from './NoteForm.module.css';
import type { CreateNote } from '../../types/note';
import { useId } from 'react';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../services/noteService';
import toast from 'react-hot-toast';

interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const initialValues: CreateNote = {
  title: '',
  content: '',
  tag: 'Todo',
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title too short')
    .max(50, 'Title too long')
    .matches(
      /^[^\s].*[^\s]$/,
      'Spaces at the beginning and end are not allowed'
    )
    .required('Title is required'),
  content: Yup.string().max(500, 'Content too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag')
    .required('Select tag'),
});

export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const fieldId = useId();

  const queryClient = useQueryClient();

  const postNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note'] });
      onSuccess();
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleCancel = () => {
    onCancel();
  };

  const handleSubmit = (
    values: CreateNote,
    actions: FormikHelpers<CreateNote>
  ) => {
    values.content = values.content.trim();
    postNoteMutation.mutate(values);
    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            id={`${fieldId}-content`}
            name="content"
            as="textarea"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            id={`${fieldId}-tag`}
            name="tag"
            as="select"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={postNoteMutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
