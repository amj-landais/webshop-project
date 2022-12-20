import {useState} from 'react';
import {Navigate} from 'react-router-dom';

function InputFormRegister(props) {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [email, setEmail] = useState('');

    const [registered, setRegistered] = useState(false);
    const [failed, setFailed] = useState(false);

    function updateUValue(e) {
        setUser(e.target.value);
    }

    function updatePValue(e) {
        setPass(e.target.value);
    }

    function updateEValue(e) {
        setEmail(e.target.value);
    }

    const registerHandler = (user, pass, email) => {
        console.log('Registering ', user, pass, email);
        fetch(' http://127.0.0.1:8000/api/auth/v1/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user,
                password: pass,
                email: email
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('http error: ' + response.statusCode)
                }
                return response.json()
            })
            .then(data => {
                console.log('data ', data);
                setRegistered(true);
                setFailed(false);
            })
            .catch(response => {
                setRegistered(false);
                setFailed(true);
            })
    }


    const registerStyle = {
        width: '90%',
        height: '500px',
        backgroundColor: '#c4dede',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const buttonStyle = {
        borderColor: '#0e434f',
        color: '#0e434f',
        backgroundColor: '#b2c7c7',
        borderRadius: 12,
        margin: 20,
        width: 100,
        height: 50,
        fontWeight: 'bold'
    }


    if (registered) return <Navigate replace to={'/shop/login'}></Navigate>
    else return (
        <div style={registerStyle}>
            <label style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50px'}}>
                        User:
                    </div>
                    <input type='text' value={user} onChange={updateUValue}/>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50px'}}>
                        Pass:
                    </div>
                    <input type='text' value={pass} onChange={updatePValue}/>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '50px'}}>
                        Email:
                    </div>
                    <input type='text' value={email} onChange={updateEValue}/>
                </div>
            </label>
            <button style={buttonStyle} onClick={() => registerHandler(user, pass, email)}>{props.text}</button>

            {failed && <font style={{color: 'red', margin: '30px'}}>Registration Failed</font>}
        </div>
    )
}

export default InputFormRegister;
