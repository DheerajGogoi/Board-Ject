import './ForgotPass.scss'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { auth } from '../../firebase';
import { Button, CircularProgress, Snackbar, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

export default function ForgotPass() {
    const [isLoading, setIsLoading] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false);

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackOpen(false);
    };

    const [email, setEmail] = useState('');

    const history = useHistory();
    
    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        auth.sendPasswordResetEmail(email)
        .then(() => {
            setSnackOpen(true);
        })
        .catch(e => {
            console.log(e.message)
            alert(e.message)
        })
        .finally(()=>{
            setIsLoading(false);
            setEmail('');
        })
    }

    return (
        <div className='login-screen'>
            <div className='login-container container'>
                
            <h1>Forgot Password</h1>
            <div className='login-form'>
                <form autoComplete='off' onSubmit={handleEmailSubmit}>
                    <div>
                        <TextField
                        placeholder='Email'
                        type='email'
                        id="outlined-basic"
                        variant="outlined"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        className='input'
                        />
                    </div>

                    <Button variant='contained' type='submit' style={{
                        width: '350px',
                    }}>
                        {!isLoading ? 'Submit' : <CircularProgress size={25} style={{
                            color: 'black',
                        }} />}
                    </Button>
                    <br />
                    <br />
                    <Button variant='outlined' onClick={()=>history.goBack()}>
                        Go Back
                    </Button>
                </form>
            </div>

            </div>

            <>
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackClose}
                >
                    <MuiAlert
                        onClose={handleSnackClose}
                        severity="success"
                        variant="filled"
                    >
                        Email Sent. Check Your Email !!!
                    </MuiAlert>
                </Snackbar>
            </>
        </div>
    )
}
