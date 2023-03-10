import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';
import { onError } from '../lib/errorLib';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { s3Upload } from '../lib/awsLib';
import './Notes.css';

function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get('notes', `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, '');
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  //Save the note by making a PUT request with the note object
  // to /notes/:id where the id comes from the useParams hook
  function saveNote(note) {
    return API.put('notes', `/notes/${id}`, {
      body: note,
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
        // If there is a file to upload, call s3Upload to upload it
        // and save the key from s3 as attachment
      if (file.current) {
        attachment = await s3Upload(file.current);
        await Storage.remove(note.attachment, { level: 'private'});
      }
      //If there isn't a file to upload, simply save the existing attachment object
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      nav('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  //Make a delete request to /notes/:id 
  function deleteNote() {
    return API.del('notes', `/notes/${id}`);
  }
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteNote();
      await Storage.remove(note.attachment, { level: 'private'});
      nav('/');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }
  
  return (
    <div className='Notes'>
    {/* render the form only when the note state variable is set */}
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='content'>
            <Form.Control
              as='textarea'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId='file'>
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target='_blank'
                  rel='noopener noreferrer'
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type='file' />
          </Form.Group>
          <div className='d-grid gap-2'>
          <LoaderButton
            block='true'
            size='lg'
            type='submit'
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          </div>
          <div className='d-grid gap-2'>
          <LoaderButton
            block='true'
            size='lg'
            variant='danger'
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
          </div>
        </Form>
      )}
    </div>
  );
}

export default Notes;