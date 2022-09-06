import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {Navigate} from "react-router-dom";
import {loginTC} from "./auth-reducer";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

export const Login = () => {

    const dispatch = useDispatch<ThunkDispatch<AppRootStateType, void, AnyAction>>()
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)

    type FormikErrorType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Пустое поле!'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }


            if (!values.password) {
                errors.password = 'Пустое поле.Введите значение!'
            } else if (values.password.length < 3) {
                errors.password = 'Пароль должен быть больше 3 символов'
            }

            return errors

        },
        onSubmit: values => {
            dispatch(loginTC(values))
        },

    })
    if (isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return (
        <Grid container justifyContent={'center'}>
            <Grid item justifyContent={'center'}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>

                    <form onSubmit={formik.handleSubmit}>
                        <FormGroup>
                            <TextField label="Email"
                                       margin="normal"
                                       name="email"
                                       onChange={formik.handleChange}
                                       value={formik.values.email}
                                       onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}
                            <TextField type="password"
                                       label="Password"
                                       margin="normal"
                                       {...formik.getFieldProps('password')}
                                // name="password"
                                // onChange={formik.handleChange}
                                // value={formik.values.password}
                                // onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && <div style={{color: 'red'}}>{formik.errors.password}</div>}

                            <FormControlLabel label={'Remember me'}
                                              control={<Checkbox
                                                  name="rememberMe"
                                                  onChange={formik.handleChange}
                                                  value={formik.values.rememberMe}
                                              />}

                            />

                            <Button type={'submit'} variant={'contained'} color={'primary'}>
                                Login
                            </Button>
                        </FormGroup>
                    </form>

                </FormControl>

            </Grid>
        </Grid>
    )
}