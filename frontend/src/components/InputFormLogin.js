import {useState} from "react";
import {Navigate} from "react-router-dom";

function InputFormLogIn(props) {

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');

    function updateUValue(e) {
        setUser(e.target.value);
    }

    function updatePValue(e) {
        setPass(e.target.value);
    }

    const loginStyle = {
        width: "90%",
        height: "500px",
        backgroundColor: "#c4dede",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }

    const buttonStyle = {
        borderColor: "#0e434f",
        color: "#0e434f",
        backgroundColor: "#b2c7c7",
        borderRadius: 12,
        margin: 20,
        width: 100,
        height: 50,
        fontWeight: "bold"
    }

    if (props.loggedIn) return <Navigate to="/myitems" replace/>
    else return (
        <div style={loginStyle}>
            <label>
                User: <input type='text' value={user} onChange={updateUValue}/>
            </label>
            <label>
                Pass: <input type='password' value={pass} onChange={updatePValue}/>
            </label>
            <button style={buttonStyle}
                    onClick={() => props.login(user, pass)}>{props.text}</button>
        </div>
    )
}

export default InputFormLogIn;
