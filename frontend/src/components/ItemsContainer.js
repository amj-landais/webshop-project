function ItemsContainer(props) {
    function updateSearchText(e) {
        console.log(e.target.value)
        props.setSearchText(e.target.value);
    }

    //--------------------------- CSS ------------------------------

    const icStyle = {
        backgroundColor: '#c4dede',
        width: '90vw',
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

    const centerStyle = {
        display: 'flex',
        justifyContent: 'center'
    }


    //--------------------------- RETURN ------------------------------

    return (
        <div style={icStyle}>
            <h1>Available items</h1>
            <div style={centerStyle}>
                <form>
                    <input id='searchBar' type='text' value={props.searchText} onChange={updateSearchText}
                           placeholder="Search an item here"/>
                </form>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {props.availableItems}
            </div>
            <div>
                <div>
                    {props.availableItems.length} of the {props.totalNumberItems} items are displayed.
                </div>
                {props.next && <button style={buttonStyle} onClick={props.loadMoreHandler}>
                    Load more items
                </button>}
                {props.loading && <h4>Loading ... {props.next} </h4>}
                {(props.error !== "") && <h4>Error ... {props.error}</h4>}
            </div>
        </div>
    )
}

export default ItemsContainer;
