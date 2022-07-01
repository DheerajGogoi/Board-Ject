import './Login.scss'
import React, { useState, useEffect } from 'react'
import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import { auth, db } from '../../firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { ApiRoute } from '../../Util';
import axios from 'axios';

function Login() {
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();
    
    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        auth.signInWithEmailAndPassword(email, pass)
        .then((authUser) => {
            alert('Success');
            db.collection("users").where("user_uid","==", authUser.user.uid).get()
            .then(function(snapshot){
                // console.log(snapshot.docs[0].data());
                const userDocId = snapshot.docs[0].id;
                const userCred = {
                    displayName: snapshot.docs[0].data().displayName,
                    email: snapshot.docs[0].data().email,
                    fName: snapshot.docs[0].data().fName,
                    lName: snapshot.docs[0].data().lName,
                    password: snapshot.docs[0].data().password,
                    profile: snapshot.docs[0].data().profile,
                    user_uid: snapshot.docs[0].data().user_uid,
                    _id: snapshot.docs[0].data()._id
                }
                axios.post(ApiRoute('/login'), userCred)
                .then((result) => {
                    result = result.data;
                    dispatch(authActions.login({userCred, userDocId, userJWT: result}));
                    setIsLoading(false);
                })
            })
        })
        .catch(e => {
            console.log(e.message)
            alert(e.message)
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }
    // isLoading

    return (
        <div className='login-screen'>
            <div className='login-container container'>
                
                <div className='row'>
                    <div className='col-lg-6'></div>
                    
                    <div className='col-lg-6'>

                        <h1>Login Screen</h1>
                        <div className='login-form'>
                            <form autoComplete='off' onSubmit={handleLogin}>
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

                                <div>
                                    <TextField
                                    placeholder='Password'
                                    type='password'
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={pass}
                                    onChange={(e)=>setPass(e.target.value)}
                                    required
                                    className='input'
                                    />
                                </div>

                                <Button variant='contained' type='submit' style={{
                                    width: '350px',
                                }}>
                                    {!isLoading ? 'Login' : <CircularProgress size={25} style={{
                                        color: 'black',
                                    }} />}
                                </Button>
                                <br />
                                <br />
                                <Link to='/forgot_password'>Forgot Password ?</Link>
                            </form>

                            <br />

                            <Button style={{
                                textTransform: 'none',
                                marginTop: '30px'
                            }} variant='outlined' onClick={()=>history.push('/register')} >New user ? Create an account</Button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login;
