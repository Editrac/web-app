import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
import { StepOne, StepThree, StepTwo } from './signup-steps';
import Button from 'src/components/button/text.button';

const Authenticate: React.FC = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const step = query.get("step");

  return (
    <>
      <div className="max-w-sm m-auto bg-bg rounded-t-2xl rounded-b-lg px-10 py-6 mt-20 flex">
        {(step === "2" || step === "3") && <div className="-ml-3 pr-1">
          <IconButton onClick={() => navigate(-1)} aria-label="delete" size="small" color="secondary" edge="start">
            <KeyboardBackspaceIcon style={{ fontSize: 24 }} />
          </IconButton>
        </div>}
        <div className="pl-1">
          <p className="text-base font-bold">{step === "3" ? "Set Password" : step === "2" ? "Enter OTP" : "Sign up to ediflo"}</p>
          <p className="text-sm mt-0.5 text-grey-5">{step === "3" ? "Set password to complete sign up" : step === "2" ? "Check your email for OTP" : "Sign up and create your organisation"}</p>
        </div>
      </div>
      <div className="max-w-sm m-auto bg-bg rounded-lg pt-8 pb-10 px-10 mt-0.5">
        {step === "3" ?
          <StepThree />
          : step === "2" ?
            <StepTwo />
            : <StepOne />
        }
      </div>
      <div className="max-w-sm m-auto bg-bg rounded-b-2xl rounded-t-lg px-10 py-3 mt-0.5 flex">
        <span className="text-sm mt-0.5 flex flex-1">Already have an account?</span>
        <Button type="button" onClick={() => navigate("/signin")} variant="text-accent" size="regular">
          <span>Sign in &#8594;</span>
        </Button>
      </div>
    </>
  )
}

export default Authenticate;