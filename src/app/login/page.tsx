'use client'
/*
 The login page will be the shown at the start of the 
 application. When a successfull login is done, then
 we can proceed to the application.
*/

//Imports
import { useRouter } from "next/navigation";
import React, {useState} from "react";
import { gatewayApi } from "../../store";

/*
 The LoginFormFields and LoginFormElements are used to
 provide types to the submit handler.
*/

interface LoginFormFields extends HTMLFormControlsCollection {
  bearerToken: HTMLInputElement
  cameraGroup: HTMLInputElement
}

interface LoginFormElements extends HTMLFormElement {
  readonly elements: LoginFormFields
}

//Types
type LoginError = {
  type: string;
  message: string;
}

/*
 CameraGroup needs to be validated before sending the 
 request.
*/
function validateCameraGroupInput(cameraGroup: string): boolean {
  const cameraGroupRegularExpression = /^[a-zA-Z0-9\-_]+$/;
  return cameraGroupRegularExpression.test(cameraGroup);
}

export default function Login() {
  const [loginErrors, setLoginErrors] = useState({});
  const router = useRouter();

  const {useCreateCameraGroupMutation} = gatewayApi;
  const [createCameraGroup, {isLoading}] = useCreateCameraGroupMutation();
  
  /*
    These error objects provide meaningful messages to the user in order to 
    correct the mistakes they made while logging in.
  */
  const invalidBearerTokenError: LoginError = {
    type: 'BearerTokenError',
    message: "*Bearer Token isn't correct.(See .env.local file!)"
  }
  const invalidCameraGroupError: LoginError = {
    type: 'CameraGroupError',
    message: "*The camera group isn't valid(Valid input: Starts and ends with: [a-zA-Z0-9\-_](NO SPACES))"
  }

  const handleSubmit = async (e: React.FormEvent<LoginFormElements>) => {
    e.preventDefault();

    //Errors should disappear when we submit the form.
    //TODO Maybe it would be better for errors to disappear when the user begins editing the inputs again.
    setLoginErrors({});

    let inputErrors = {};

    const {elements} = e.currentTarget;

    //Using trim to remove any leading/trailing white space from the user's input.
    const bearerToken = elements.bearerToken.value.trim();
    const cameraGroup = elements.cameraGroup.value.trim();

    //Bearer token has to be the same as the bearer in the .env.local file
    const isBearerTokenValid = process.env.NEXT_PUBLIC_RECOGNITION_TOKEN == bearerToken
    if (!isBearerTokenValid) {
      inputErrors[invalidBearerTokenError.type] = invalidBearerTokenError.message;
    }

    //cameraGroup has to comply with the regular expression: ^[a-zA-Z0-9\-_]+$
    const isCameraGroupValid = validateCameraGroupInput(cameraGroup);
    if (!isCameraGroupValid) {
      inputErrors[invalidCameraGroupError.type] = invalidCameraGroupError.message;
    }

    if (Object.hasOwn(inputErrors, 'BearerTokenError') || Object.hasOwn(inputErrors, 'CameraGroupError')) {
      setLoginErrors(inputErrors);
      return;
    }

    try {
      await createCameraGroup(cameraGroup).unwrap();

      //We should show the dashboard if the login was successfull
      router.push('/dashboard');
    }
    catch (cameraGroupError) {
      inputErrors['CameraGroupError'] = `${cameraGroup} ${cameraGroupError.data}`;
      setLoginErrors(inputErrors);
    }
  }

  return (
    <section className="login-section">
      <h2>
        Hello! In order to use Dishtracker, you need to provide the Bearer token and
        create a CameraGroup to start with.
      </h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bearerToken">Bearer token</label>
        <span className="login-error-message">{loginErrors['BearerTokenError']}</span>
        <input type="text" id="bearerToken" required />
        <label htmlFor="cameraGroup">CameraGroup</label>
        <span className="login-error-message">{loginErrors['CameraGroupError']}</span>
        <input type="text" id="cameraGroup" required />
        <button disabled={isLoading} type="submit">Log in</button>
      </form>
    </section>
  );
}