import {useState} from "react";

function EditItem(props) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');

    const [failedDeletion, setFailedDeletion] = useState(false);
    const [failedModification, setFailedModification] = useState(false);

    function updateTValue(e) {
        setTitle(e.target.value);
    }

    function updateDValue(e) {
        setDescription(e.target.value);
    }

    function updatePValue(e) {
        setPrice(e.target.value);
    }


    function closeClick() {
        const modal = document.getElementById('modalEdit' + props.item.pk);
        modal.style.display = 'none';
    }

    function openModalEdit() {
        setTitle(props.item.title)
        setPrice(props.item.price)
        setDescription(props.item.description)
        const modal = document.getElementById('modalEdit' + props.item.pk);
        modal.style.display = 'block';
    }


    const editItem = () => {
        console.log('Editing item');
        setFailedModification(false);
        fetch(' http://127.0.0.1:8000/api/v1/item/' + props.item.pk, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + props.token,
            },
            body: JSON.stringify({
                title: title,
                description: description,
                price: price,
                status: props.item.status
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
                closeClick();
                props.fetchUserItems();
                setFailedModification(false);
            })
            .catch(response => {
                console.log("Change item failed : ", response);
                setFailedModification(true);
            })
    }


    const deleteItem = () => {
        console.log('Deleting item');
        setFailedDeletion(false);
        fetch(' http://127.0.0.1:8000/api/v1/item/' + props.item.pk, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + props.token,
            },
            body: ''
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('http error: ' + response.statusCode)
                }
                return response.json()
            })
            .then(data => {
                console.log('data ', data);
                closeClick();
                props.fetchUserItems();
                setFailedDeletion(false);
            })
            .catch(response => {
                console.log("Delete item failed : ", response);
                setFailedDeletion(true);
            })
    }

    //-------------------------CSS--------------------------------
    const modal = {
        display: 'none',
        position: 'fixed', /* Stay in place */
        zIndex: '1', /* Sit on top */
        left: '0',
        top: '0',
        width: '100%', /* Full width */
        height: '100%', /* Full height */
        overflow: 'auto', /* Enable scroll if needed */
        backgroundColor: 'rgba(0,0,0,0.6)', /* Black w/ opacity */
    }

    const modalContent = {
        backgroundColor: '#dff8f8',
        margin: '15% auto', /* 15% from the top and centered */
        padding: '20px',
        border: '3px solid #0e434f',
        width: '50%',
    }

    const close = {
        color: 'red',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        border: '2px solid #0e434f',
        borderRadius: '8px',
        width: '35px',
        height: '35px',
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

    const buttonRedStyle = {
        borderColor: '#7a020a',
        color: '#7a020a',
        backgroundColor: '#eea7ad',
        borderRadius: 12,
        margin: 20,
        width: 100,
        height: 50,
        fontWeight: 'bold'
    }

    const editStyle = {
        color: '#0e434f',
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const editContentStyle = {}

    const inputStyle = {
        fontFamily: 'Helvetica',
        fontSize: '15px',
    }


    return (
        <div style={editStyle}>

            <div>
                <button style={buttonStyle} onClick={openModalEdit}>
                    Edit your item
                </button>
            </div>


            <div style={modal} id={'modalEdit' + props.item.pk}>
                <div style={modalContent}>
                    <span style={close} onClick={closeClick}>&times;</span>
                    <div style={editContentStyle}>
                        <h1> Edit your item</h1>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <div style={{display: 'flex', margin: '10px'}}>
                                <div style={{width: '150px', textAlign: 'left'}}>
                                    Title:
                                </div>
                                <input style={inputStyle} type='text' value={title.toString()} maxLength='25'
                                       onChange={updateTValue}/>
                            </div>
                            <div style={{display: 'flex', margin: '10px'}}>
                                <div style={{width: '150px', textAlign: 'left'}}>
                                    Description:
                                </div>
                                <textarea style={inputStyle} value={description.toString()} maxLength='100'
                                          onChange={updateDValue} cols="30" rows="4"/>
                            </div>
                            <div style={{display: 'flex', margin: '10px'}}>
                                <div style={{width: '150px', textAlign: 'left'}}>
                                    Price (€):
                                </div>
                                <input style={inputStyle} type='text' value={price.toString()} onChange={updatePValue}/>
                            </div>
                        </div>

                        <div>
                            <button style={buttonStyle} onClick={editItem}>
                                Submit modifications
                            </button>

                            <button style={buttonRedStyle} onClick={deleteItem}>
                                Delete this item
                            </button>
                        </div>


                        {failedDeletion && <div style={{color: 'red'}}> Item deletion failed</div>}
                        {failedModification && <div style={{color: 'red'}}> Item modification failed</div>}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditItem;
