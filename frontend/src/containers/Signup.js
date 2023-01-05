import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../lib/contextLib";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import "./Signup.css";
import { Auth } from 'aws-amplify';

function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        email: '',
        password: '',
        confirmPassword: '',
        confirmationCode: '',
    });

    const nav = useNavigate();
    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);

    function validateForm() {
        return (
            fields.email.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        //Connect with AWS Cognito setup
        try{
            //Signup a user with aws
            const newUser = await Auth.signUp({
                username: fields.email,
                password: fields.password,
            });
        setIsLoading(false);
        //Save the user object to the state
        setNewUser(newUser);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    async function handleConfirmationSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        //Connect with AWS Cognito setup
        try{
            //Confirm the user with confirmation code and sign the user in
            await Auth.confirmSignUp(fields.email, fields.confirmationCode);
            await Auth.signIn(fields.email, fields.password);
            userHasAuthenticated(true);
            nav('/');
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function renderConfirmationForm(){
        return(
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId='confirmationCode' size='lg'>
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type='tel'
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code</Form.Text>
                </Form.Group>
                <div className='d-grid gap-2'>
                <LoaderButton
                    block='true'
                    size='lg'
                    type='submit'
                    variant='success'
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
                </div>
            </Form>
        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='email' size='lg'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autofocus
                        type='email'
                        value={fields.email}
                        onChange={handleFieldChange}
                    />                    
                </Form.Group>
                <Form.Group controlId='password' size='lg'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId='confirmPassword' size='lg'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control 
                        type='password'
                        value={fields.confirmPassword}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <div className='d-grid gap-2'>
                <LoaderButton
                    block='true'
                    size='lg'
                    type='submit'
                    variant='success'
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
                </div>
            </Form>
        );
    }

    return (
        <div className='Signup'>
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );

}

export default Signup;