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
import login_page from '../../images/login_page.png'
import icon from '../../images/icon.png'

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
            <div className='login-container'>
                
                <div className='row'>
                    
                    <div className='col-lg-6'>
                        <Header />

                        <h1>Welcome!</h1>
                        <p className='welc-desc'>Welcome back! Please enter your details.</p>
                        <div className='login-form'>
                            <form autoComplete='off' onSubmit={handleLogin}>
                                <div>
                                    <TextField
                                    placeholder='Email'
                                    type='email'
                                    id="outlined-basic"
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
                                    value={pass}
                                    onChange={(e)=>setPass(e.target.value)}
                                    required
                                    className='input'
                                    />
                                </div>

                                <div>
                                    <Link to='/forgot_password' style={{
                                        textAlign: 'right',
                                        float: 'right',
                                        color: 'black',
                                        fontSize: '14px',
                                        textDecoration: 'underline',
                                    }}>Forgot Password</Link>
                                </div>

                                <Button variant='contained' type='submit' style={{
                                    width: '350px',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    marginTop: '2rem',
                                    textTransform: 'none'
                                }} disableElevation>
                                    {!isLoading ? 'Log in' : <CircularProgress size={25} style={{
                                        color: 'white',
                                    }} />}
                                </Button>
                                
                            </form>

                            {/* <Button style={{
                                textTransform: 'none',
                                marginTop: '30px'
                            }} variant='outlined' onClick={()=>history.push('/register')} >New user ? Create an account</Button> */}
                            <p className='reg-desc'>Don't have an account? <Link onClick={()=>{}} to='/register' style={{
                                color: 'black',
                                fontWeight: 'bold'
                            }}>Sign up for free</Link></p>
                        </div>

                    </div>

                    <div className='col-lg-6'>
                        <div className='image-container'>
                            <img src={login_page} alt='Login Page Image' className='img-fluid login-image' />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

const Header = () => {
    return(
        <div style={{
            padding: '14px',
            fontWeight: 'bolder',
            fontSize: '2rem'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px'
            }}>
                <img src={icon} alt='Icon' className='img-fluid' style={{
                    width: '80px',
                    alignSelf: 'center'
                }} />
                <p style={{
                    alignSelf: 'center',
                    marginTop: '20px'
                }}>BoardJect</p>
            </div>
        </div>
    )
}

export default Login;
