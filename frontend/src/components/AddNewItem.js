import {useState} from "react";


function AddNewItem(props) {

    const [hide, setHide] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [failed, setFailed] = useState(false);

    function updateTValue(e) {
        setTitle(e.target.value);
    }

    function updateDValue(e) {
        setDescription(e.target.value);
    }

    function updatePValue(e) {
        setPrice(e.target.value);
    }


    const reinitializeFields = () => {
        setHide(true);
        setTitle('');
        setPrice('');
        setDescription('');
    }

    //'v1/items/user/

    const addItemHandler = (itemTitle, itemDescription, itemPrice) => {
        console.log('Adding ', itemTitle);
        fetch(' http://127.0.0.1:8000/api/v1/items/user/'+props.token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: itemTitle,
                description: itemDescription,
                price: itemPrice
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
                setFailed(false);
                setHide(true);
                reinitializeFields()
                props.fetchUserItems();
            })
            .catch(response => {
                setFailed(true);
            })
    }


    //--------------------------CSS----------------------------------------
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

    const close = {
        borderColor: "#0e434f",
        backgroundColor: "#b2c7c7",
        borderRadius: 12,
        margin: 20,
        width: 100,
        height: 50,
        fontWeight: "bold",
        color: 'red',
        border: '2px solid #0e434f',
    }

    const addStyle = {
        backgroundColor: '#dff8f8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '2px solid #0e434f',
    }

    const inputStyle = {
        fontFamily:'Helvetica',
        fontSize: '15px',
    }

    return (
        <div style={{width: '80%', margin: '30px'}}>
            {hide && <button style={buttonStyle} onClick={() => setHide(false)}>Add new item</button>}
            {!hide && <div style={addStyle}>
                <h3 style={{padding: '10px'}}> Details about my new item </h3>
                <label
                    style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{display: 'flex', margin: '10px'}}>
                        <div style={{width: '150px', textAlign: 'left'}}>
                            Title:
                        </div>
                        <input style={inputStyle} type='text' value={title} maxLength='25' onChange={updateTValue}/>
                    </div>
                    <div style={{display: 'flex', margin: '10px'}}>
                        <div style={{width: '150px', textAlign: 'left'}}>
                            Description:
                        </div>
                        <textarea style={inputStyle} value={description} maxLength='100' onChange={updateDValue} cols="30" rows="4"/>
                    </div>
                    <div style={{display: 'flex', margin: '10px'}}>
                        <div style={{width: '150px', textAlign: 'left'}}>
                            Price (€):
                        </div>
                        <input style={inputStyle} type='text' value={price} onChange={updatePValue}/>
                    </div>
                </label>

                <div style={{display: 'flex'}}>
                    <button style={buttonStyle} onClick={() => addItemHandler(title, description, price)}>Add my new item</button>
                    <button style={close} onClick={reinitializeFields}>Cancel</button>
                </div>

                {failed && <div style={{color: 'red'}}> Adding the item failed</div>}

            </div>}
        </div>
    )
}

export default AddNewItem;
