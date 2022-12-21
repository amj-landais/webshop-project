import {Navigate} from 'react-router-dom';
import {useState} from 'react';

function Account(props) {

    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [change, setChange] = useState(false);
    const username = props.username;

    function updateOldValue(e) {
        setOldPass(e.target.value);
    }

    function updateNewValue(e) {
        setNewPass(e.target.value);
    }

    //--------------------- CHANGING PASSWORD --------------------------
    const [failed, setFailed] = useState(false);

    const changePassword = (oldPass, newPass) => {
        setFailed(false);
        setChange(false);
        console.log('Changing password ', oldPass, newPass);
        fetch(' http://127.0.0.1:8000/api/auth/v1/passchange/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + props.token,
            },
            body: JSON.stringify({
                token: props.token,
                old_password: oldPass,
                new_password: newPass,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Changing password not successful')
                }
                return response.json()
            })
            .then(data => {
                console.log('data ', data);
                setChange(true);
            })
            .catch((err) => {
                console.log('Error ', err);
                setFailed(true);
            })
    }

    //--------------------------- CSS ------------------------------

    const accountStyle = {
        width: '90%',
        height: '500px',
        backgroundColor: '#c4dede',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }

    const fieldStyle = {
        width: '200px'
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

    //--------------------------- RETURN ------------------------------

    if (!props.loggedIn) return <Navigate to='/login' replace/>
    else return (
        <div style={accountStyle}>
            <div style={{margin: 20, display: 'flex'}}>
                <div style={fieldStyle}>Username:</div>
                <div style={{width: 200, textAlign: 'left'}}>
                    {username}
                </div>
            </div>
            <label style={{display: 'flex'}}>
                <div style={fieldStyle}>Old password:</div>
                <input style={{width: 200}} type='password' value={oldPass} onChange={updateOldValue}/>
            </label>
            <label style={{display: 'flex'}}>
                <div style={fieldStyle}>New password:</div>
                <input style={{width: 200}} type='password' value={newPass} onChange={updateNewValue}/>
            </label>
            <button style={buttonStyle}
                    onClick={() => changePassword(oldPass, newPass)}>Change password
            </button>

            {failed && <font style={{color: 'red', margin: '30px'}}>Changing password failed</font>}
            {change && <font style={{color: '#509324', margin: '30px'}}>Password changed successfully</font>}
        </div>
    )
}

export default Account;
