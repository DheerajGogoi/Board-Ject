import './Register.scss'
import React, { useState, useEffect } from 'react';
import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../redux-store/store';
import { auth, db } from '../../firebase';
import { useHistory } from 'react-router';
import axios from 'axios';
import { ApiRoute } from '../../Util';

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [cpass, setCpass] = useState('');
    const [fName, setFname] = useState('');
    const [lName, setLname] = useState('');

    const dispatch = useDispatch();
    const history = useHistory();
    
    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoading(true);
        auth.createUserWithEmailAndPassword(email, pass)
        .then((authUser) => {
            alert('Success');
            
            authUser.user.updateProfile({
                displayName: fName+" "+lName,
            })

            const userCred = {
                displayName: fName+" "+lName,
                email: email,
                fName: fName,
                lName: lName,
                password: pass,
                profile: "",
                profileName: "",
                user_uid: authUser.user.uid,
                _id: Date.now(),
            }

            db.collection("users").add(userCred)
            .then(() => {
                alert("Welcome "+fName+" "+lName);

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
        })
        .catch(e => {
            console.log(e.message)
            alert(e.message)
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    return (
        <div className='register-screen'>
            <>
                <Backdrop open={isLoading}>
                    <CircularProgress style={{
                        color: 'white'
                    }} />
                </Backdrop>
            </>
            <div className='register-container container'>
                <div className='row'>

                    <div className='col-lg-6'></div>

                    <div className='col-lg-6'>

                        <h1>Register Screen</h1>
                        <div className='register-form'>
                            <form autoComplete='off' onSubmit={handleRegister}>
                                <div>
                                    <TextField
                                    placeholder='First Name'
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={fName}
                                    onChange={(e)=>setFname(e.target.value)}
                                    required
                                    className='input'
                                    />
                                </div>

                                <div>
                                    <TextField
                                    placeholder='Last name'
                                    id="outlined-basic"
                                    variant="outlined"
                                    value={lName}
                                    onChange={(e)=>setLname(e.target.value)}
                                    required
                                    className='input'
                                    />
                                </div>

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
                                    width: '100%'
                                }}>Register</Button>
                            </form>
                            
                            <br />
                            <br />

                            <Button style={{
                                textTransform: 'none',
                                marginTop: '30px'
                            }} variant='outlined' onClick={()=>history.push('/login')} >Already have an account ?</Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
